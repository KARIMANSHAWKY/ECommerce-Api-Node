const hasWhiteSpaceFun = require('./has-white-space');

async function storeImage(file, direPath) {
  let originalName =  file.name;
  let fileName = '';
  if (hasWhiteSpaceFun.hasWhiteSpace(originalName)) {
    let fileWithoutSpace = originalName.split(" ").join("");
      fileName =  Date.now() + "-" + fileWithoutSpace
  } else {
     fileName = Date.now() + "-" + file.name;
  }

  let filePath = direPath + "/uploads/" + fileName;
  file.mv(filePath);
  return fileName;
}




module.exports = { storeImage };
