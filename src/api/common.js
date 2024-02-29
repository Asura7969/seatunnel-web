import { getDatasource } from "./api";
import DorisIcon from "../assets/doris.svg";
import MysqlIcon from "../assets/mysql.svg";
import PostgresqlIcon from "../assets/postgresql.svg";
import StarrocksIcon from "../assets/starrocks.svg";

export const renderIcon = (icon) => {
  return h(
    NIcon,
    {
      style: {
        verticalAlign: "-0.15em",
        marginRight: "4px",
      },
    },
    {
      default: () => h(icon),
    }
  );
};

export const chooseIcon = (type) => {
  if (type == "DORIS") {
    return renderIcon(DorisIcon);
  } else if (type == "MYSQL") {
    return renderIcon(MysqlIcon);
  } else if (type == "PG") {
    return renderIcon(PostgresqlIcon);
  } else if (type == "STARROCKS") {
    return renderIcon(StarrocksIcon);
  } else {
    console.log("未知数据源:" + type);
    return null;
  }
};
