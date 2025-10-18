import fetch from 'node-fetch';
import express from "express"
import axios from 'axios'
import * as cheerio from 'cheerio'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const app = express();
const salats = ["sobh", "dhuhr", "asr", "maghrib", "isha"];

app.get("/api/v1/:city_idx/:salat/:day_of_month", async (req, res) => {
  const { city_idx, salat, day_of_month } = req.params;
  const URL = `https://habous.gov.ma/prieres/horaire_hijri_2.php?ville=${city_idx}`

  try {
    const $ = await cheerio.fromURL(URL)
    const allDays = $("tr")

    allDays.each((index, element) => {
      const tr = $(element).find("td:nth-child(3)")
      if (Number(tr.text()) === Number(day_of_month)) {
        if (salat === "sobh") {
          res.send($(element).find("td:nth-child(4)").text().replaceAll('\n', '').trim())
        } else if (salat === "sunrise") {
          res.send($(element).find("td:nth-child(5)").text().replaceAll('\n', '').trim())
        } else if (salat === "dhuhr") {
          res.send($(element).find("td:nth-child(6)").text().replaceAll('\n', '').trim())
        } else if (salat === "asr") {
          res.send($(element).find("td:nth-child(7)").text().replaceAll('\n', '').trim())
        } else if (salat === "maghrib") {
          res.send($(element).find("td:nth-child(8)").text().replaceAll('\n', '').trim())
        } else if (salat === "isha") {
          res.send($(element).find("td:nth-child(9)").text().replaceAll('\n', '').trim())
        }

        // const salats = {
        //   "sobh": $(element).find("td:nth-child(4)").text().replaceAll('\n', '').trim(),
        //   "sunrise": $(element).find("td:nth-child(5)").text().replaceAll('\n', '').trim(),
        //   "dhuhr": $(element).find("td:nth-child(6)").text().replaceAll('\n', '').trim(),
        //   "asr": $(element).find("td:nth-child(7)").text().replaceAll('\n', '').trim(),
        //   "maghreb": $(element).find("td:nth-child(8)").text().replaceAll('\n', '').trim(),
        //   "isha": $(element).find("td:nth-child(9)").text().replaceAll('\n', '').trim(),
        // }

        // res.json(salats)
      }
    })
  } catch {
    res.send("error")
  }

})

app.listen(3000, () => {
  console.log("Server is running on port 3000")
})


async function getHTML() {
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}