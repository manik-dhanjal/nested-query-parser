const SYMBOL_TO_WORD = {
    "=":"%EQUAL%",
    "?":"%QUESTION%",
    "+":"%PLUS%",
    ":":"%COLON%",
    "&":"%AND%",
    "%":"%PERCENT%",
    "[":"%LBRAC%",
    "]":"%RBRAC%",
    null:"%NULL%",
    undefined:"%UNDEFINED%",
    false:"%FALSE%",
    true:"%TRUE%"
}

const WORD_TO_SYMBOL = {
    "%EQUAL%":"=",
    "%QUESTION%":"?",
    "%PLUS%":"+",
    "%COLON%":":",
    "%AND%":"&",
    "%PERCENT%":"%",
    "%LBRAC%":"[",
    "%RBRAC%":"]",
    "%NULL%":null,
    "%UNDEFINED%":undefined,
    "%FALSE%":false,
    "%TRUE%":true,
}



module.exports = {
    SYMBOL_TO_WORD,
    WORD_TO_SYMBOL,
}