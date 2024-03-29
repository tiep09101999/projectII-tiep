import {addNewTextEmoji, addNewImage, addNewAttachment} from "../services/messageService";
import multer from "multer";
import fsExtra from "fs-extra";
// xu ly image chat
let storeImage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "src/public/images/chat/message");
    },
    filename: (req,file,callback) => {
        let imageName = `${file.originalname}`;
        callback(null, imageName);
    }
});

let imageMessageUploadFile = multer({
    storage: storeImage
}).single("my-image-chat");


// xu ly attachment chat


let storeAttachment = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "src/public/fileExample/file");
    },
    filename: (req,file,callback) => {
        let attachmentName = `${file.originalname}`;
        callback(null, attachmentName);
    }
});

let attachmentMessageUploadFile = multer({
    storage: storeAttachment
}).single("my-attachment-chat");
module.exports.addNewTextEmoji = async (req, res)=> {
    try {
        let sender = {
            id: req.user._id,
            name: req.user.username,
            avatar: req.user.avatar
        }
        let receiverId = req.body.uid;
        let messageVal = req.body.messageVal;
        let isChatGroup = req.body.isChatGroup;

  
        
      //  return res.status(200).send({message: sender})
        let newMessage = await addNewTextEmoji(sender, receiverId, messageVal, isChatGroup);

        
        return res.status(200).send({message: newMessage});
    } catch (error) {
       return res.status(500).send(error);
    }
}
module.exports.addNewImage =  (req, res)=> {
    imageMessageUploadFile(req,res, async () => {
        try {
            let sender = {
                id: req.user._id,
                name: req.user.username,
                avatar: req.user.avatar
            }
            let receiverId = req.body.uid;
            let messageVal = req.file;
            let isChatGroup = req.body.isChatGroup;
    
      
            
            //  return res.status(200).send({message: sender})
            let newMessage = await addNewImage(sender, receiverId, messageVal, isChatGroup);
            // xóa file ảnh lưu trong src/public/images/chat/message vì lúc này nó đc lưu trong DB
            await fsExtra.remove(`src/public/images/chat/message/${newMessage.file.filename}`)
            return res.status(200).send({message: newMessage});
        } catch (error) {
            console.log(error);
           return res.status(500).send(error);
        }
    });
  
} 

module.exports.addNewAttachment =  (req, res)=> {
    attachmentMessageUploadFile(req,res, async () => {
        try {
            let sender = {
                id: req.user._id,
                name: req.user.username,
                avatar: req.user.avatar
            }
            let receiverId = req.body.uid;
            let messageVal = req.file;
            let isChatGroup = req.body.isChatGroup;
    
      
            
            //  return res.status(200).send({message: sender})
            let newMessage = await addNewAttachment(sender, receiverId, messageVal, isChatGroup);
            // xóa file ảnh lưu trong src/public/fileExample/file vì lúc này nó đc lưu trong DB
            await fsExtra.remove(`src/public/fileExample/file/${newMessage.file.filename}`)
            return res.status(200).send({message: newMessage});
        } catch (error) {
            console.log(error);
           return res.status(500).send(error);
        }
    });
  
} 