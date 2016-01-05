var fs = require('fs');
var path = require('path');

var extendReg = /<!--\s*extends\s*(\S+)\s*-->/i;
var linkReg = /(<[^>]+(src|href)=")(.+?)("[^>]*>)/ig;
var blockReg = /<!--\s*block\s*(\S+)\s*-->((.|[\r\n\t])*?)<!--\s*endblock\s*-->/ig;

module.exports = function(content, file) {
    var extendMatched = content.match(extendReg);
    if (!extendMatched) {
        return content;
    }

    var layoutRelative = extendMatched[1];
    if(layoutRelative[0] === '\'' && layoutRelative[layoutRelative.length - 1] === '\'' ||
        layoutRelative[0] === '"' && layoutRelative[layoutRelative.length - 1] === '"') {
        layoutRelative = layoutRelative.substr(1, layoutRelative.length - 2);
    }
    var pageFull = file.realpath;
    var layoutFull = path.resolve(path.dirname(pageFull), layoutRelative);

    if (!fs.existsSync(layoutFull)) {
        process.stdout.write('\n '+ '[HTML_EXTEND_ERROR]'.red + ' Can not find the layout html: "' + layoutFull + '" in "' + pageFull  + '"\n');
        process.exit(1);
    }

    var layoutContent = fs.readFileSync(layoutFull, 'utf8');
    layoutContent = layoutContent.replace(linkReg, function() {
        var linkRelativeLayout = arguments[3];

        if (/^data:.*/.test(linkRelativeLayout) ||         // base64
            path.isAbsolute(linkRelativeLayout) ||         // absolute path
            /^https?:\/\/.*/.test(linkRelativeLayout)) {   // http link
            return arguments[0];
        }
        var linkFull = path.resolve(path.dirname(layoutFull), linkRelativeLayout);
        var linkRelativePage = path.relative(path.dirname(pageFull), linkFull);
        return arguments[1] + linkRelativePage + arguments[4];
    });

    var blockMathedMap = {};
    var blockMathed;
    while(blockMathed = blockReg.exec(content)) {
        blockMathedMap[blockMathed[1]] = blockMathed[2];
    }

    content = layoutContent.replace(blockReg, function() {
        var blockName = arguments[1];
        if (blockMathedMap[blockName]) {
            return blockMathedMap[blockName];
        } else {
            return arguments[2] || '';
        }
    });

    return content;
}
