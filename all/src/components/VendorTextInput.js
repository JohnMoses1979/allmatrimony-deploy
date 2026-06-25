import React, {useEffect, useState} from 'react';
import {TextInput as NativeTextInput} from 'react-native';
import {useVendorLanguage} from '../context/VendorLanguageContext';
import {translateText} from '../services/translationApi';

const placeholderCache = new Map();

const translatePlaceholder = async (placeholder, language) => {
  const cacheKey = language + ':' + placeholder;

  if (!placeholderCache.has(cacheKey)) {
    placeholderCache.set(
      cacheKey,
      translateText(placeholder, language).catch(() => placeholder),
    );
  }

  return placeholderCache.get(cacheKey);
};

export default function VendorTextInput({placeholder, ...inputProps}) {
  const {vendorLanguage} = useVendorLanguage();
  const [displayPlaceholder, setDisplayPlaceholder] = useState(placeholder);

  useEffect(() => {
    let active = true;

    if (!placeholder || vendorLanguage === 'en' || !/[A-Za-z]/.test(placeholder)) {
      setDisplayPlaceholder(placeholder);
      return () => {
        active = false;
      };
    }

    setDisplayPlaceholder(placeholder);
    translatePlaceholder(placeholder, vendorLanguage).then(translatedPlaceholder => {
      if (active) {
        setDisplayPlaceholder(translatedPlaceholder || placeholder);
      }
    });

    return () => {
      active = false;
    };
  }, [placeholder, vendorLanguage]);

  return (
    <NativeTextInput
      {...inputProps}
      placeholder={displayPlaceholder}
    />
  );
}
