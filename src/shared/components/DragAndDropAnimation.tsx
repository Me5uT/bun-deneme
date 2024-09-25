import React from "react";

const DragAndDropAnimation: React.FC = () => {
  return (
    <div
      style={{
        margin: "auto",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: "-10px",
      }}
    >
      <img
        src={"/assets/images/dragdrop.gif"}
        alt={"animation.gif"}
        style={{ width: "75px" }}
      />
    </div>
  );
};

export default React.memo(DragAndDropAnimation);
