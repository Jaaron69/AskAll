//jshint esversion:6
import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2";
import session from "express-session";
import fs from "fs";
import CloudmersiveConvertApiClient from 'cloudmersive-convert-api-client';
import fileUpload from "express-fileupload";

const app = express();

app.use(fileUpload());
app.use(
	session({
		secret: "your-secret-key",
		resave: false,
		saveUninitialized: true,
	})
);

const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

//PAGES
app.get("/", (req, res) => res.render("index.ejs"));
app.get("/about", (req, res) => res.render("about.ejs"));
app.get("/contact", (req, res) => res.render("contact.ejs"));
app.get("/service", (req, res) => res.render("service.ejs"));
app.get("/team", (req, res) => res.render("team.ejs"));
app.get("/profile", (req, res) => res.render("profile.ejs"));
app.get("/reference", (req, res) => res.render("reference.ejs"));

//FEATURES
app.get("/todo", (req, res) => res.render("todo.ejs"));
app.get("/weather", (req, res) => res.render("weather.ejs"));
app.get("/chatAI", (req, res) => res.render("chatAI.ejs"));
app.get("/calculator", (req, res) => res.render("calculator.ejs"));
app.get("/wordToPdf", (req, res) => res.render("wordToPdf.ejs"));
app.get("/pdfToWord", (req, res) => res.render("pdfToWord.ejs"));
app.get("/converter", (req, res) => res.render("converter.ejs"));

//RESUMES
app.get("/resumeChris", (req, res) => res.render("resumes/resumeChris.ejs"));
app.get("/resumeGracezen", (req, res) =>
	res.render("resumes/resumeGracezen.ejs")
);
app.get("/resumeMark", (req, res) => res.render("resumes/resumeMark.ejs"));
app.get("/resumeNath", (req, res) => res.render("resumes/resumeNath.ejs"));
app.get("/resumePhoebe", (req, res) => res.render("resumes/resumePhoebe.ejs"));
app.get("/resumePunla", (req, res) => res.render("resumes/resumePunla.ejs"));
app.get("/resumeRonnie", (req, res) => res.render("resumes/resumeRonnie.ejs"));
app.get("/resumeSoza", (req, res) => res.render("resumes/resumeSoza.ejs"));
app.get("/resumeVital", (req, res) => res.render("resumes/resumeVital.ejs"));
app.get("/resumeZapanta", (req, res) =>
	res.render("resumes/resumeZapanta.ejs")
);

var defaultClient = CloudmersiveConvertApiClient.ApiClient.instance;

// Configure API key authorization: Apikey
var Apikey = defaultClient.authentications['Apikey'];
Apikey.apiKey = '3b6bfd19-9a46-44f6-91b6-a5a9b0e7b30c';

var apiInstance = new CloudmersiveConvertApiClient.ConvertDocumentApi();

const directoryPath = "C:\\xampp\\htdocs\\AskAll\\uploads";
const fileName = "Lesson11_ListView_BackKey.pdf";
const filePath = `${directoryPath}\\${fileName}`;

fs.readFile(filePath, (err, data) => {
    if (err) {
        console.error(`Error reading file ${filePath}: ${err}`);
    } else {
        const inputFile = Buffer.from(data.buffer);

        var callback = function(error, responseData, response) {
            if (error) {
                console.error(error);
            } else {
                console.log('API called successfully. Returned data: ' + responseData);
                // Handle the converted data as needed
            }
        };

        apiInstance.convertDocumentPdfToDocx(inputFile, callback);
    }
});

app.post("/convertPdfToWord", (req, res) => {
  // Check if a file was uploaded
  if (!req.files || !req.files.pdfFile) {
    return res.status(400).send("No PDF file uploaded.");
  }

  // Get the uploaded PDF file from the request
  const pdfFile = req.files.pdfFile;

  // Read the contents of the PDF file
  const inputFile = Buffer.from(pdfFile.data.buffer);

  // Call the Cloudmersive API to convert the PDF to Word
  apiInstance.convertDocumentPdfToDocx(inputFile, (error, responseData, response) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Error converting PDF to Word.");
    }

    // Handle the converted data as needed
    const docxData = Buffer.from(responseData);

    // Set the appropriate headers for download
    res.setHeader('Content-Disposition', 'attachment; filename=converted-document.docx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

    // Send the converted DOCX file as the response
    res.status(200).send(docxData);
  });
});

//SERVER PORT
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
