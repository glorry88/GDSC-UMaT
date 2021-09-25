import { google } from "googleapis";
import { config as dotenvConfig } from "dotenv";
import express from "express";
import asyncHandler from "express-async-handler";
import { parseValues } from "./utils/parseValues";

dotenvConfig();

const app = express();

const auth = new google.auth.GoogleAuth({
  keyFile: "key.json", //the key file
  //url to spreadsheets API
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});

const authClient = async () => await auth.getClient();

const googleSheetsInstance = async () =>
  google.sheets({ version: "v4", auth: await authClient() });

const fetchData = async () => {
  const sheetsInstance = await googleSheetsInstance();

  const readData = await sheetsInstance.spreadsheets.values.get({
    auth, //auth object
    spreadsheetId: process.env.SPREADSHEET, // spreadsheet id
    range: "Form Responses 1!C:C", //range of cells to read from.
  });

  const {
    data: { values },
  } = readData;
  return parseValues(values?.slice(1));
  //   return values;
};

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

app.get(
  "/",
  asyncHandler(async (req, res) => {
    const values = await fetchData();

    res.send(values);
  })
);
