import React, {useEffect, useMemo, useState} from "react";
import {Text as NativeText} from "react-native";
import {useMatrimony} from "../context/MatrimonyContext";
import {translateText} from "../services/translationApi";

const translationCache = new Map();

const getPlainText = children => {
  const values = React.Children.toArray(children);

  if (!values.every(value => typeof value === "string" || typeof value === "number")) {
    return null;
  }

  return values.join("");
};

const getTranslatedText = (text, language) => {
  const cacheKey = language + ":" + text;

  if (!translationCache.has(cacheKey)) {
    translationCache.set(
      cacheKey,
      translateText(text, language).catch(() => text),
    );
  }

  return translationCache.get(cacheKey);
};

export default function AdminText({
  children,
  adminTranslate = true,
  ...textProps
}) {
  const {language} = useMatrimony();
  const plainText = useMemo(() => getPlainText(children), [children]);
  const [displayText, setDisplayText] = useState(plainText);

  useEffect(() => {
    let active = true;

    if (
      !adminTranslate ||
      language === "en" ||
      plainText === null ||
      !/[A-Za-z]/.test(plainText)
    ) {
      setDisplayText(plainText);
      return () => {
        active = false;
      };
    }

    setDisplayText(plainText);
    getTranslatedText(plainText, language).then(translatedText => {
      if (active) {
        setDisplayText(translatedText || plainText);
      }
    });

    return () => {
      active = false;
    };
  }, [adminTranslate, language, plainText]);

  return (
    <NativeText {...textProps}>
      {plainText === null ? children : displayText}
    </NativeText>
  );
}
