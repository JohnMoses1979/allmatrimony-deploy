import React, {useEffect, useState} from "react";
import {TextInput as NativeTextInput} from "react-native";
import {useMatrimony} from "../context/MatrimonyContext";
import {translateText} from "../services/translationApi";

const placeholderCache = new Map();

const translatePlaceholder = (placeholder, language) => {
  const cacheKey = language + ":" + placeholder;

  if (!placeholderCache.has(cacheKey)) {
    placeholderCache.set(
      cacheKey,
      translateText(placeholder, language).catch(() => placeholder),
    );
  }

  return placeholderCache.get(cacheKey);
};

export default function AdminTextInput({placeholder, ...inputProps}) {
  const {language} = useMatrimony();
  const [displayPlaceholder, setDisplayPlaceholder] = useState(placeholder);

  useEffect(() => {
    let active = true;

    if (!placeholder || language === "en" || !/[A-Za-z]/.test(placeholder)) {
      setDisplayPlaceholder(placeholder);
      return () => {
        active = false;
      };
    }

    setDisplayPlaceholder(placeholder);
    translatePlaceholder(placeholder, language).then(translatedPlaceholder => {
      if (active) {
        setDisplayPlaceholder(translatedPlaceholder || placeholder);
      }
    });

    return () => {
      active = false;
    };
  }, [language, placeholder]);

  return (
    <NativeTextInput
      {...inputProps}
      placeholder={displayPlaceholder}
    />
  );
}
