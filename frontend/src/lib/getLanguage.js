export function getLanguageNameById(languageId) { //getLanguageName
    const LANGUAGE_NAMES = {

        63: "JAVASCRIPT",
        71: "PYTHON",
        62: "JAVA",
        54: "C++",
    }
    return LANGUAGE_NAMES[languageId] || "Unknown language"
}

export function getLanguageIdByName(language) {  //getLanguageId
    const languageMap = {
        "PYTHON": 71,
        "JAVA": 62,
        "JAVASCRIPT": 63,
        "C++": 54
    }
    return languageMap[language.toUpperCase()];
}


