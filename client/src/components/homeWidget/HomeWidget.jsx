import React from "react";
import "./style.scss";
import ItemMd from "../itemMd/ItemMd";
import ItemSm from "../itemSm/ItemSm";
import { useHistory } from "react-router-dom";

const getRouteLink = (type) => {
  switch (type) {
    case "materials":
      return "/materials/all";
    case "tasks":
      return "/tasks/all";
    case "schedules":
      return "/createclass";
    case "doubts":
      return "/doubts/all";
    default:
      return null;
  }
};

const getButtonLabel = (type) => {
  switch (type) {
    case "materials":
      return "Subject Matter";
    case "tasks":
      return "Tasks & Assignments";
    case "schedules":
      return "Class Schedule";
    case "doubts":
      return "Queries and Questions";
    default:
      return "";
  }
};

const getButtonDescription = (type) => {
  switch (type) {
    case "materials":
      return "Access all your class notes and materials here.";
    case "tasks":
      return "View and manage your assignments and tasks.";
    case "schedules":
      return "Check your upcoming classes & timings here .";
    case "doubts":
      return "Post or respond to queries and doubts..............";
    default:
      return "";
  }
};

const HomeWidget = ({
  title,
  type,
  forLargeItems,
  forSmallItems,
  itemList,
  noSeeAll,
}) => {
  const history = useHistory();

  const routeLink = getRouteLink(type);
  const buttonLabel = getButtonLabel(type);
  const buttonDescription = getButtonDescription(type);

  const handleClick = () => {
    if (routeLink) history.push(routeLink);
  };

  return (
    <div className={"widget-container " + type}>
      {buttonLabel && (
        <div className="home-widget-button-wrapper">
          <div className="custom-home-button" onClick={handleClick}>
            <h2>{buttonLabel}</h2>
            <p className="description">{buttonDescription}</p>
          </div>
        </div>
      )}

      {forLargeItems &&
        type === "all-classes" &&
        itemList?.map((item, index) => (
          <ItemMd type="class" key={item._id} index={index} data={item} />
        ))}

      {forLargeItems &&
        type !== "all-classes" &&
        itemList?.map((item, index) => (
          <ItemMd
            index={index}
            type={type.slice(0, -1)}
            key={item._id}
            data={item}
          />
        ))}

      {forSmallItems &&
        itemList?.map((item, index) => (
          <ItemSm
            index={index}
            type={type.slice(0, -1)}
            key={item._id}
            data={item}
            noLink={type === "schedules"}
          />
        ))}
    </div>
  );
};

export default HomeWidget;
