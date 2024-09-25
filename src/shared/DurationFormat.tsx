import React from "react";
import { Storage } from "app/shared/util/LocalStorage";
import dayjs from "dayjs";

export interface IDurationFormat {
  value: any;
  blankOnInvalid?: boolean;
  locale?: string;
}

export const DurationFormat = ({
  value,
  blankOnInvalid,
  locale,
}: IDurationFormat) => {
  if (blankOnInvalid && !value) {
    return null;
  }

  if (!locale) {
    locale = Storage.local.get("locale") || "en";
  }

  return (
    <span title={value}>
      {dayjs
        .duration(value)
        .locale(locale || "en")
        .humanize()}
    </span>
  );
};
