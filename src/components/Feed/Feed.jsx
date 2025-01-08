import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./Feed.css";
import InputOption from "../InputOption/InputOption";
import ImageIcon from "@mui/icons-material/Image";
import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";
import CalendarViewDayIcon from "@mui/icons-material/CalendarViewDay";
import EventNoteIcon from "@mui/icons-material/EventNote";
import Post from "../Post/Post";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";
import { AnimatePresence, motion } from "framer-motion";

const Feed = () => {
  const user = useSelector(selectUser);
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState([]);

  // useEffect() hook -> special hook which allows us to fire of code when the feed component loads, it also allows us to fire it of whenever the component renders if we don't pass the second arguemnt. if we pass in a blank dependency like this [], then it will fire of once when feed component loads but it will never fire of again after that.
  useEffect(() => {
    // Fetch the collection and set up real-time updates
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc")); // Order by timestamp in descending order
    const unsubscribe = onSnapshot(q, snapshot => {
      setPosts(
        snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  const sendPost = async e => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "posts"), {
        name: user.displayName,
        description: user.email,
        message: input, // Update this with your input value if needed
        timestamp: serverTimestamp(),
        photoUrl: user.photoURL || "",
      });
    } catch (error) {
      console.error("Error adding post: ", error);
    }

    setInput("");
  };

  return (
    <div className="feed">
      <div className="feed__inputContainer">
        <div className="feed__input">
          <Avatar src={user?.photoURL} alt={user?.displayName || "User"}>
            {user?.displayName ? user.displayName[0] : "U"}
          </Avatar>
          <form>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              type="text"
            />
            <button onClick={sendPost} type="submit">
              Send
            </button>
          </form>
        </div>

        <div className="feed__inputOptions">
          <InputOption title="Photo" color="#70B5F9" Icon={ImageIcon} />
          <InputOption title="Video" color="#E7A33E" Icon={SmartDisplayIcon} />
          <InputOption title="Event" color="#C0CBCD" Icon={EventNoteIcon} />
          <InputOption
            title="Write article"
            color="#7FC15E"
            Icon={CalendarViewDayIcon}
          />
        </div>
      </div>

      {/* Posts */}
      <AnimatePresence>
        {posts.map(({ id, data: { name, description, message, photoUrl } }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <Post
              key={id}
              name={name}
              description={description}
              message={message}
              photoUrl={photoUrl}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Feed;
