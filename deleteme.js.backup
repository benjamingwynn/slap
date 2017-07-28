var hl = require("highlightjs")

function comment (selection, lang, altToggle) {
	
	function deRegex (string) {
		function r (a, b, c) {
			return a.split(b).join(c)
		}
		
		return r(r(string, "\\", ""), "$", "")
	}
	
	var commentModes = []
	
	hl.getLanguage(lang).contains.forEach((obj) => {
		if (obj.className === "comment") {
			commentModes.push(obj)
		}
	})
	
	var commentMode = commentModes[(altToggle && commentModes.length > 1) ? 1 : 0]
	var insBefore = deRegex(commentMode.begin)
	var insAfter = deRegex(commentMode.end)
	
	if (insAfter) {
		var isBefore = selection.indexOf(insBefore) === 0,
			isAfter = selection.lastIndexOf(insAfter) + insAfter.length === selection.length
		
		if (isBefore && isAfter) {
			return selection.substring(insBefore.length, selection.length - insAfter.length)
		}
	
		return insBefore + selection + insAfter
	}
	
	var lines = selection.split("\n"),
		originalLines = lines.slice(), // clone
		nLinesAlreadyCommented = 0
	
	lines.forEach((line, index) => {
		if (line.indexOf(insBefore) === 0) {
			nLinesAlreadyCommented += 1
		}
		
		lines[index] = insBefore + line + insAfter
	})
	
	// count the number of commented. if it was all of them then
	// we should uncomment instead
	if (nLinesAlreadyCommented === lines.length) {
		originalLines.forEach((line, index) => {
			lines[index] = line.replace(insBefore, "")
		})
	}
	
	return lines.join("\n")
}

console.log(comment(`whatever = true
if (whatever) {
	okay()
}`, "js", true))