import React, { useState } from "react";
import "../../assets/css/emailRow.css";
import { Checkbox, IconButton } from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import LabelImportantIcon from "@mui/icons-material/LabelImportant";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { selectMail } from "../../control/mailSlice";
import StarIcon from "@mui/icons-material/Star";

const EmailRow = ({ id, title, subject, description, time }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [starred, setStarred] = useState(false);

  const openMail = () => {
    dispatch(
      selectMail({
        id,
        title,
        subject,
        description,
        time,
      })
    );

    navigate("/mail")
  };

  const handleStarClick = (e) => {
    e.stopPropagation();
    setStarred(!starred);
  };



  return (
    <div onClick = {openMail} className="emailRow">
      <div className="emailRow_options">
        <Checkbox />
        <IconButton  onClick={handleStarClick}>
          {starred ? <StarIcon/> : <StarBorderIcon/>}
        </IconButton>
        <IconButton>
          <LabelImportantIcon />
        </IconButton>
      </div>

      <h3 className="emailRow_title">{title}</h3>

      <div className="emailRow_message">
        <h4 className="emailMessage">
          {subject} <span className="emailRow_description">-{description}</span>
        </h4>
      </div>

      <p className="emailRow_time">{time}</p>
    </div>
  );
};

export default EmailRow;
