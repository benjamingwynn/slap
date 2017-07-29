/*
    some very rushed code which can toggle comment on a block of code
    accepts three arguments, two of which are required:
    
    selection: the block of code to toggle comment
    lang: the language in which the code is written
    altToggle: a boolean on whether to use an alternative mode of commenting, if available
*/

var hl = require("highlightjs")

function comment (selection, lang, altToggle) {
    // a super simple function to replace all occurances of a string with another string within a string
    function replaceAll (a, b, c) {
        return a.split(b).join(c)
    }
    
    // for regular expressions which basically just look for a string, this function attempts to find the string it's looking for
	function deRegex (regex) {
        // alias for replaceAll
        var r = replaceAll
        
        // FUTURE: this needs more testing! It might not work for every scenario
		return r(r(regex, "\\", ""), "$", "")
	}
	
    // gather all of the possible comment types in the language
    
	var commentModes = []
	
	hl.getLanguage(lang).contains.forEach((obj) => {
		if (obj.className === "comment") {
			commentModes.push(obj)
		}
	})
	
	var commentMode = commentModes[(altToggle && commentModes.length > 1) ? 1 : 0]
	
    // what comes before/after a newly commented bit of code?
    var insBefore = deRegex(commentMode.begin)
	var insAfter = deRegex(commentMode.end)
	
	if (insAfter) {
        // is the code alradey commented?
		var isBefore = selection.trim().indexOf(insBefore) === 0,
			isAfter = selection.trim().lastIndexOf(insAfter) + insAfter.length === selection.trim().length,
            
            // calculate the length of the left and right line padding (spaces, tabs)
            lTrimLen = selection.length - selection.trimLeft().length,
            rTrimLen = selection.length - selection.trimRight().length,
            // get the left and right line padding as a string
            lTrimStr = selection.substr(0, lTrimLen),
            rTrimStr = selection.substr(selection.length - rTrimLen, selection.length)
		
        console.log("lTrimStr", "'" + lTrimStr + "'")
        console.log("rTrimStr", "'" + rTrimStr + "'")
        
		if (isBefore && isAfter) {
            // remove the comment
			return lTrimStr + selection.substring(insBefore.length + lTrimLen, selection.length - insAfter.length) + rTrimStr
		}
        
        // the code is not already commented, so comment it out
		return insBefore + selection + insAfter
	}
    
    // we dont have insafter, so this is a comment like this
    /* rather than like this */
	
	var lines = selection.split("\n"),
		originalLines = lines.slice(), // clone
		nLinesAlreadyCommented = 0
	
	lines.forEach((line, index) => {
		if (line.trim().indexOf(insBefore) === 0) {
            // count the number of commented
			nLinesAlreadyCommented += 1
		}
		
		lines[index] = insBefore + line + insAfter
	})
	
	// if it was all of them we should uncomment instead
	if (nLinesAlreadyCommented === lines.length) {
		originalLines.forEach((line, index) => {
			lines[index] = line.replace(insBefore, "")
		})
	}
	
	return lines.join("\n")
}

// export
module.exports = comment