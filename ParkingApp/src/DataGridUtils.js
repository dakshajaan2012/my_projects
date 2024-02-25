import {
  getGridNumericOperators,
  getGridSingleSelectOperators,
  getGridStringOperators,
  getGridDateOperators,
} from "@mui/x-data-grid";

import moment from "moment";

export const Operator = {
  CONTAINS_STRING: "contains",
  EQUALS_STRING: "equals",
  ENDS_WITH_STRING: "endsWith",
  STARTS_WITH_STRING: "startsWith",
  EQUAL_NUMBER: "=",
  GREATER_THAN_NUMBER: ">",
  GREATER_THAN_OR_EQUAL_TO_NUMBER: ">=",
  IS_EMPTY_NUMBER: "isEmpty",
  IS_NOT_EMPTY_NUMBER: "isNotEmpty",
  LESS_THAN_NUMBER: "<",
  LESS_THAN_OR_EQUAL_TO_NUMBER: "<=",
  NOT_EQUAL_NUMBER: "!=",
  IS_SINGLE_SELECT: "is",
  IS_NOT_SINGLE_SELECT: "not",
  IS_ANY_OF_SINGLE_SELECT: "isAnyOf",
  IS_DATE: "isDate",
  IS_NOT_DATE: "notDate",
  IS_AFTER_DATE: "after",
  IS_ON_OR_AFTER_DATE: "onOrAfter",
  IS_BEFORE_DATE: "before",
  IS_ON_OR_BEFORE_DATE: "onOrBefore",
};

export const getApplicableOperatorsList = (columnType) => {
  try {
    if (!columnType) return;
    switch (columnType) {
      case "number":
        const numericOperators = getGridNumericOperators();
        if (!numericOperators) throw new Error("Numeric operator");
        return numericOperators.filter(
          (operator) =>
            operator.value === Operator.EQUAL_NUMBER ||
            operator.value === Operator.GREATER_THAN_NUMBER ||
            operator.value === Operator.GREATER_THAN_OR_EQUAL_TO_NUMBER ||
            operator.value === Operator.LESS_THAN_NUMBER ||
            operator.value === Operator.LESS_THAN_OR_EQUAL_TO_NUMBER
        );
      case "dateTime":
        const dateTimeOperators = getGridDateOperators(true);
        if (!dateTimeOperators) throw new Error("DateTime operator");
        return dateTimeOperators.filter(
          (operator) =>
            operator.value === Operator.IS_SINGLE_SELECT ||
            operator.value === Operator.IS_NOT_SINGLE_SELECT ||
            operator.value === Operator.IS_AFTER_DATE ||
            operator.value === Operator.IS_ON_OR_AFTER_DATE ||
            operator.value === Operator.IS_BEFORE_DATE ||
            operator.value === Operator.IS_ON_OR_BEFORE_DATE
        );
      case "date":
        const dateOperators = getGridDateOperators();
        if (!dateOperators) return;
        return dateOperators.filter(
          (operator) =>
            operator.value === Operator.IS_SINGLE_SELECT ||
            operator.value === Operator.IS_NOT_SINGLE_SELECT ||
            operator.value === Operator.IS_AFTER_DATE ||
            operator.value === Operator.IS_ON_OR_AFTER_DATE ||
            operator.value === Operator.IS_BEFORE_DATE ||
            operator.value === Operator.IS_ON_OR_BEFORE_DATE
        );
      case "singleSelect":
        const singleSelectOperators = getGridSingleSelectOperators();
        if (!singleSelectOperators) throw new Error("SingleSelect operator");
        return singleSelectOperators.filter(
          (operator) =>
            operator.value === Operator.IS_SINGLE_SELECT ||
            operator.value === Operator.IS_NOT_SINGLE_SELECT ||
            operator.value === Operator.IS_ANY_OF_SINGLE_SELECT
        );
      default:
        const stringOperators = getGridStringOperators();
        if (!stringOperators) throw new Error("String operator");
        return stringOperators.filter(
          (operator) =>
            operator.value === Operator.CONTAINS_STRING ||
            operator.value === Operator.EQUALS_STRING ||
            operator.value === Operator.ENDS_WITH_STRING ||
            operator.value === Operator.STARTS_WITH_STRING
        );
    }
  } catch (error) {
    console.log("ERROR getting applicable operator list: ", error);
  }
};

export const renderDateTime = (createdDate, withTime) => {
  try {
    if (!createdDate) return null;
    let date;
    if (withTime) date = moment(createdDate).format("DD MMM YYYY | HH:mm");
    if (!withTime) date = moment(createdDate).format("DD MMM YYYY");
    if (!date) return null;
    return date;
  } catch (error) {
    return null;
  }
};
