import React, { useContext, useState } from "react";
import Img from "../../assets/img/img.png";
import Attach from "../../assets/img/attach.png";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase/ChatFirebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async (e) => {
    e.preventDefault();
  
    if (!text.trim() && !img) {
      return;
    }
  
    if (img) {
      const storageRef = ref(storage, uuid());
  
      const uploadTask = uploadBytesResumable(storageRef, img);
  
      uploadTask.on(
        (error) => {
          //TODO:Handle Error
        },
        () => {
          getDownloadURL(storageRef).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text:"image",
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }
  
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text: img ? "📷 Photo" : text, 
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
  
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text: img ? "📷 Photo" : text, 
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
  
    setText("");
    setImg(null);
  };
  
  
  return (
    <div className="input">
      <form onSubmit={handleSend}>
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <img src={Attach} alt="" />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button >Send</button>
      </div>
      </form>
    </div>
  );
};

export default Input