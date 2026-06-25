import React, {useEffect, useMemo, useState} from 'react';
import {Text as NativeText} from 'react-native';
import {useVendorLanguage} from '../context/VendorLanguageContext';
import {translateText} from '../services/translationApi';

const translationCache = new Map();

const getPlainText = children => {
  const values = React.Children.toArray(children);

  if (!values.every(value => typeof value === 'string' || typeof value === 'number')) {
    return null;
  }

  return values.join('');
};

const getTranslatedText = async (text, language) => {
  const cacheKey = language + ':' + text;

  if (!translationCache.has(cacheKey)) {
    translationCache.set(
      cacheKey,
      translateText(text, language).catch(() => text),
    );
  }

  return translationCache.get(cacheKey);
};

export default function VendorText({
  children,
  vendorTranslate = true,
  ...textProps
}) {
  const {vendorLanguage} = useVendorLanguage();
  const plainText = useMemo(() => getPlainText(children), [children]);
  const [displayText, setDisplayText] = useState(plainText);

  useEffect(() => {
    let active = true;

    if (
      !vendorTranslate ||
      vendorLanguage === 'en' ||
      plainText === null ||
      !/[A-Za-z]/.test(plainText)
    ) {
      setDisplayText(plainText);
      return () => {
        active = false;
      };
    }

    setDisplayText(plainText);
    getTranslatedText(plainText, vendorLanguage).then(translatedText => {
      if (active) {
        setDisplayText(translatedText || plainText);
      }
    });

    return () => {
      active = false;
    };
  }, [plainText, vendorLanguage, vendorTranslate]);


  return (
    <NativeText {...textProps}>
      {plainText === null ? children : displayText}
    </NativeText>
  );
}
