import React,{useEffect,useState} from "react";
import { View,StyleSheet,ScrollView,TouchableOpacity,Image,Alert,ActivityIndicator,Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import{useNavigation} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import Text from "../../components/AdminText";
import TextInput from "../../components/AdminTextInput";
import { API_BASE_URL, toApiAssetUrl, toStoredAssetPath } from "../../config/api";
import { COLORS } from "../../constants/colors";
import { useMatrimony } from "../../context/MatrimonyContext";
import { resetNavigationToLogin } from "../../utils/logoutNavigation";

const ADMIN_PROFILE_ID = "1";
const DEFAULT_ADMIN_PROFILE = {
    fullName:"Admin",
    email:"admin@allmatrimony.com",
    mobile:"",
    role:"ADMIN",
    address:"",
    about:"All Matrimony application administrator",
    profileImageUrl:"",
};

export default function AdminProfileScreen(){
    const navigation = useNavigation ();
    const { language, setLanguage } = useMatrimony();

    const [adminId,setAdminId] =useState(ADMIN_PROFILE_ID);
    const [loading,setLoading] =useState(true);
    const [saving,setSaving]=useState(false);
    const [uploadingImage,setUploadingImage]=useState(false);

    const [editMode,setEditMode] =useState(false);

    const [profile,setProfile] =useState(DEFAULT_ADMIN_PROFILE);

    useEffect(()=>{
        loadAdminIdAndProfile();
    },[]);

    const loadAdminIdAndProfile = async () => {
        try{
            await AsyncStorage.setItem("ADMIN_ID", ADMIN_PROFILE_ID);
            setAdminId(ADMIN_PROFILE_ID);
            await fetchProfile(ADMIN_PROFILE_ID, {silent:true});
        } catch (error) {
            console.log("admin profile initial load error:", error);
            setProfile(DEFAULT_ADMIN_PROFILE);
        } finally{
            setLoading(false);
        }
    };
    const fetchProfile = async (id, options = {}) =>{
        try{
            const response =await fetch (`${API_BASE_URL}/api/admin/profile/${id}`);

            if(!response.ok){
                throw new Error("Failed to fetch profile");
            }

            const data =await response.json();
            setProfile({
                fullName:data.fullName||"",
                email:data.email||"",
                mobile:data.mobile || "",
                role:data.role || "ADMIN",
                address:data.address || "",
                about:data.about ||"",
                profileImageUrl:data.profileImageUrl || "",
            });
        } catch(error){
            console.log("profile fetch error:",error);
            if (!options.silent) {
                Alert.alert("Error","Unable to fetch admin profile");
            }
        }
    };
    const updateField =(key,value) =>{
        setProfile((prev)=>({
            ...prev,
            [key]:value,
        }));
    };
    const uploadProfileImage = async (asset) => {
        if (!asset?.uri) return;

        try {
            setUploadingImage(true);
            const formData = new FormData();
            const fallbackName = `admin-profile-${Date.now()}.jpg`;

            if (Platform.OS === "web" && asset.file) {
                formData.append("file", asset.file, asset.file.name || fallbackName);
            } else {
                formData.append("file", {
                    uri: asset.uri,
                    name: asset.fileName || fallbackName,
                    type: asset.mimeType || "image/jpeg",
                });
            }

            const response = await fetch(`${API_BASE_URL}/api/uploads/profile-image`, {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            const imagePath = data?.data?.imagePath || data?.data?.imageUrl;

            if (!response.ok || data?.success === false || !imagePath) {
                throw new Error(data?.message || "Image upload failed");
            }

            updateField("profileImageUrl", toStoredAssetPath(imagePath));
            Alert.alert("Success", "Photo uploaded. Tap Save Profile to keep it.");
        } catch (error) {
            console.log("admin profile image upload error:", error);
            Alert.alert("Upload Failed", error.message || "Unable to upload profile photo");
        } finally {
            setUploadingImage(false);
        }
    };

    const chooseProfileImage = async () => {
        try {
            if (Platform.OS !== "web") {
                const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (!permission.granted) {
                    Alert.alert("Permission Required", "Please allow photo access to choose an image.");
                    return;
                }
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: Platform.OS !== "web",
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets?.length) {
                await uploadProfileImage(result.assets[0]);
            }
        } catch (error) {
            Alert.alert("Image Error", "Unable to select an image. Please try again.");
        }
    };

    const takeProfilePhoto = async () => {
        try {
            const permission = await ImagePicker.requestCameraPermissionsAsync();
            if (!permission.granted) {
                Alert.alert("Permission Required", "Please allow camera access to take a photo.");
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
                cameraType: ImagePicker.CameraType.front,
            });

            if (!result.canceled && result.assets?.length) {
                await uploadProfileImage(result.assets[0]);
            }
        } catch (error) {
            Alert.alert("Camera Error", "Unable to open the camera. Please try again.");
        }
    };
    const saveProfile =async () => {
        if(!profile.fullName.trim()) {
            Alert.alert("Validation","Admin name is required");
            return;
        }
        if (!profile.email.trim()) {
            Alert.alert("Validation","Email is required");
            return;
        }

        if(!profile.mobile.trim()){
            Alert.alert("Validation","Mobile number is required");
            return;
        }
        try {
            setSaving(true);
            const response =await fetch (
                `${API_BASE_URL}/api/admin/profile/${adminId}`,
                {
                    method:"PUT",
                    headers:{
                        "Content-Type":"application/json",
                    },
                    body:JSON.stringify(profile),
                }
            );
            if (!response.ok){
                const errorText =await response.text();
                throw new Error(errorText || "Profile update failed");
            }
            const data =await response.json();
            setProfile({
                fullName:data.fullName ||"",
                email:data.email || "",
                mobile:data.mobile || "",
                role:data.role || "ADMIN",
                address:data.address || "",
                about:data.about || "",
                profileImageUrl:data.profileImageUrl || "",
            });

            setEditMode(false);
            Alert.alert("Success","Admin profile updated successfully");
        } catch (error){
            console.log("profile save error:",error);
            Alert.alert("Error","Failed to update admin profile");
        } finally{
            setSaving(false);
        }
    };

    const changeAdminLanguage = (nextLanguage) => {
        setLanguage?.(nextLanguage, {persistBackend:false});
    };
    const performLogout = async () => {
        try {
            await AsyncStorage.multiRemove([
                "TOKEN",
                "token",
                "ADMIN_ID",
                "adminId",
                "USER_ROLE",
                "role",
            ]);
        } catch (error) {
            console.log("admin logout storage error:", error);
        } finally {
            resetNavigationToLogin(navigation);
        }
    };

    const logout = () => {
        const title = "Logout";
        const message = "Are you sure you want to logout?";

        if (Platform.OS === "web") {
            const confirmed = typeof window === "undefined" || window.confirm(message);
            if (confirmed) performLogout();
            return;
        }

        Alert.alert(title, message, [
            {text:"Cancel", style:"cancel"},
            {text:"Logout", style:"destructive", onPress:performLogout},
        ]);
    };

    if (loading){
        return(
            <View style={styles.center}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading admin profile ...</Text>
            </View>
        );
    }

    const imageSource = profile.profileImageUrl
        ? {uri:toApiAssetUrl(profile.profileImageUrl)}
        : null;
    return(
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <LinearGradient
                colors={[COLORS.primaryDark, COLORS.primary]}
                style={styles.header}
            >
                {imageSource ? (
                    <Image source={imageSource} style={styles.avatar}/>
                ) : (
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                        <Ionicons name="person" size={52} color={COLORS.primary} />
                    </View>
                )}

                <Text style={styles.name}>{profile.fullName || "Admin"}</Text>
                <Text style={styles.role}>{profile.role || "ADMIN"}</Text>
            </LinearGradient>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Admin Profile</Text>

                    {!editMode ? (
                        <TouchableOpacity style={styles.editButton}
                        onPress={()=> setEditMode(true)}
                        >
                            <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                    ):(
                        <TouchableOpacity style={styles.cancelButton}
                        onPress={()=>{
                            setEditMode(false);
                            fetchProfile(adminId);
                        }}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <Text style={styles.label}>Full Name</Text>
                <TextInput 
                style={[styles.input,!editMode && styles.disabledInput]}
                value={profile.fullName}
                editable={editMode}
                placeholder="Enter admin name"
                onChangeText={(text)=>updateField ("fullName",text)}
                />

                <Text style={styles.label}>Email</Text>
                <TextInput 
                style={[styles.input,!editMode && styles.disabledInput]}
                value={profile.email}
                editable={editMode}
                placeholder="Enter email"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(text)=> updateField("email",text)}
                />

                <Text style={styles.label}>Mobile Number</Text>
                <TextInput
                style={[styles.input,!editMode && styles.disabledInput]}
                value={profile.mobile}
                editable={editMode}
                placeholder="Enter mobile number "
                keyboardType="phone-pad"
                maxLength={10}
                onChangeText={(text)=> updateField("mobile", text)}
                />

                <Text style={styles.label}>Address</Text>
                <TextInput 
                style={[
                    styles.input,
                    styles.multiInput,
                    !editMode && styles.disabledInput,
                ]}
                value={profile.address}
                editable={editMode}
                placeholder="Ente address"
                multiline
                onChangeText={(text)=> updateField("address",text)}
                />

                <Text style={styles.label}>About</Text>
                <TextInput 
                style={[
                    styles.input,
                    styles.multiInput,
                    !editMode && styles.disabledInput,
                ]}
                value={profile.about}
                editable={editMode}
                placeholder="Ente about admin"
                multiline
                onChangeText={(text)=> updateField("about",text)}
                />
                <Text style={styles.label}>Profile Image</Text>
                <View style={styles.imageActions}>
                    <TouchableOpacity
                        style={[styles.imageButton, (!editMode || uploadingImage) && styles.disabledButton]}
                        onPress={chooseProfileImage}
                        disabled={!editMode || uploadingImage}
                    >
                        <Ionicons name="images-outline" size={19} color={COLORS.white} />
                        <Text style={styles.imageButtonText}>Choose Photo</Text>
                    </TouchableOpacity>

                    {Platform.OS !== "web" && (
                        <TouchableOpacity
                            style={[styles.imageButton, (!editMode || uploadingImage) && styles.disabledButton]}
                            onPress={takeProfilePhoto}
                            disabled={!editMode || uploadingImage}
                        >
                            <Ionicons name="camera-outline" size={19} color={COLORS.white} />
                            <Text style={styles.imageButtonText}>Take Photo</Text>
                        </TouchableOpacity>
                    )}
                </View>
                {uploadingImage && (
                    <View style={styles.uploadingRow}>
                        <ActivityIndicator size="small" color={COLORS.primary} />
                        <Text style={styles.uploadingText}>Uploading photo...</Text>
                    </View>
                )}

                {editMode && (
                    <TouchableOpacity 
                    style={styles.saveButton}
                    onPress={saveProfile}
                    disabled={saving}
                    >
                        {saving ?(
                            <ActivityIndicator color="#fff"/>
                        ):(
                            <Text style={styles.saveButtonText}>Save Profile</Text>
                        )}
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Account</Text>

                <Text style={styles.label}>Language</Text>
                <View style={styles.languageRow}>
                    <TouchableOpacity
                        style={[styles.languageOption, language === "en" && styles.languageOptionActive]}
                        onPress={() => changeAdminLanguage("en")}
                    >
                        <Text
                            adminTranslate={false}
                            style={[styles.languageOptionText, language === "en" && styles.languageOptionTextActive]}
                        >
                            English
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.languageOption, language === "te" && styles.languageOptionActive]}
                        onPress={() => changeAdminLanguage("te")}
                    >
                        <Text
                            adminTranslate={false}
                            style={[styles.languageOptionText, language === "te" && styles.languageOptionTextActive]}
                        >
                            తెలుగు
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
            <View style={{height:40}}/>
        </ScrollView>
    );
}

const styles =StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:COLORS.bg,
    },

    center:{
        flex:1,
        backgroundColor:COLORS.bg,
        alignItems:"center",
        justifyContent:"center",
    },
    loadingText:{
        marginTop:10,
        fontSize:14,
        color:COLORS.muted,
    },
    header:{
        backgroundColor:COLORS.primary,
        paddingTop:45,
        paddingBottom:35,
        alignItems:"center",
        borderBottomLeftRadius:28,
        borderBottomRightRadius:28,
    },
    avatar:{
        width:105,
        height:105,
        borderRadius:55,
        borderWidth:4,
        borderColor:"#fff",
        backgroundColor:"#eee",
    },
    name:{
        marginTop:12,
        fontSize:22,
        fontWeight:"800",
        color:"#fff",
    },
    
    role:{
        marginTop:4,
        fontSize:14,
        fontWeight:"600",
        color:COLORS.bg2,
    },

    card:{
        backgroundColor:COLORS.white,
        marginHorizontal:16,
        marginTop:18,
        borderRadius:18,
        padding:16,
        elevation:3,
        shadowColor:"#000",
        shadowOpacity:0.08,
        shadowRadius:8,
        shadowOffset:{width:0,height:3},
    },

    cardHeader:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        marginBottom:12,
    },
    cardTitle:{
        fontSize:18,
        fontWeight:"800",
        color:COLORS.text,
    },

    editButton:{
        backgroundColor:COLORS.primary,
        paddingHorizontal:18,
        paddingVertical:8,
        borderRadius:20,
    },

    editButtonText:{
        color:"#fff",
        fontWeight:"700",
    },
    cancelButton:{
        backgroundColor:"#eee",
        paddingHorizontal:18,
        paddingVertical:8,
        borderRadius:20,
    },

    cancelButtonText:{
        color:"#333",
        fontWeight:"700",
    },
    label:{
        fontSize:14,
        fontWeight:"700",
        color:COLORS.text,
         marginTop:12,
         marginBottom:6,
    },

    input:{
        borderWidth:1,
        borderColor:COLORS.border,
        borderRadius:12,
        paddingHorizontal:14,
        paddingVertical:11,
        fontSize:15,
        backgroundColor:COLORS.white,
        color:COLORS.text,
    },
    disabledInput:{
        backgroundColor:COLORS.softCream,
        color:COLORS.muted,
    },
    multiInput:{
        minHeight:80,
        textAlignVertical:"top",
    },

    saveButton:{
        marginTop:20,
        backgroundColor:COLORS.primary,
        paddingVertical:14,
        borderRadius:14,
        alignItems:"center",
    },

    saveButtonText:{
        color:"#fff",
        fontSize:16,
        fontWeight:"800",
    },

    avatarPlaceholder:{
        alignItems:"center",
        justifyContent:"center",
    },
    imageActions:{
        flexDirection:"row",
        flexWrap:"wrap",
        gap:10,
    },
    imageButton:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
        gap:7,
        backgroundColor:COLORS.primary,
        paddingHorizontal:14,
        paddingVertical:11,
        borderRadius:12,
        flexGrow:1,
    },
    imageButtonText:{
        color:COLORS.white,
        fontWeight:"800",
    },
    disabledButton:{
        opacity:0.45,
    },
    uploadingRow:{
        flexDirection:"row",
        alignItems:"center",
        gap:8,
        marginTop:10,
    },
    uploadingText:{
        color:COLORS.muted,
        fontSize:13,
        fontWeight:"600",
    },
    languageRow:{
        flexDirection:"row",
        gap:10,
    },
    languageOption:{
        flex:1,
        alignItems:"center",
        justifyContent:"center",
        paddingVertical:12,
        borderRadius:12,
        borderWidth:1,
        borderColor:COLORS.border,
        backgroundColor:COLORS.white,
    },
    languageOptionActive:{
        backgroundColor:COLORS.primary,
        borderColor:COLORS.primary,
    },
    languageOptionText:{
        color:COLORS.text,
        fontWeight:"800",
    },
    languageOptionTextActive:{
        color:COLORS.white,
    },
    logoutButton:{
        marginTop:14,
        backgroundColor:COLORS.danger,
        paddingVertical:14,
        borderRadius:14,
        alignItems:"center",
        },

        logoutButtonText:{
            color:"#fff",
            fontSize:16,
            fontWeight:"800",
        },
});