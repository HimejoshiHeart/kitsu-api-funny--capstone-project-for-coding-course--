// HINTS:
// 1. Import express and axios
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

// 2. Create an express app and set the port number.
const app = express();
const port = 3000;
const API_URL = "https://kitsu.io/api/edge/users?filter[name]=";
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 3. Use the public folder for static files.
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});
// app.get("/submit", (req, res) => {
//     const THE = req.query.person;

//     console.log("https://kitsu.io/api/edge/users?filter[name]=" + THE)
//     axios.get(
//         "https://kitsu.io/api/edge/users?filter[name]=" + THE
//     )
//     .then((message) => { console.log(message) })
//     .catch((error) => { console.log(error) });
// });

app.get("/submit", (req, res) => {
  var THE = req.query.person;
  var stuff;
  var current = 0;
  var planned = 0;
  var completed = 0;
  var onhold = 0;
  var dropped = 0;
  axios
    .get("https://kitsu.io/api/edge/users?filter[name]=" + THE)
    .then((message) => {
      
      stuff = message.data.data;
      //   console.log();
      var idd = stuff[0].id;
      var avatar = stuff[0].attributes.avatar.medium;
      if (stuff[0].attributes.gender == "female") {
        var g = "f";
        var gen = "A GIRL";
      } else if (stuff[0].attributes.gender == "male") {
        var g = "m";
        var gen = "A GUY";
      } else if (
        stuff[0].attributes.gender == "secret" ||
        stuff[0].attributes.gender == undefined
      ) {
        var g = "e";
        var gen = "AMBIGUOUSLY GENDERED!!!";
      } else {
        var g = "c";
        var gen = stuff[0].attributes.gender;
      }
      var lover = stuff[0].attributes.waifuOrHusbando;
      axios
        .get(
          "https://kitsu.io/api/edge/users/" +
            idd +
            "/library-entries?page%5Blimit%5D=20&page%5Boffset%5D=0"
        )
        .then((message) => {
          var total = message.data.meta.count;

          // console.log(total)
          // console.log(message.data.data[0].relationships.media.links.related)
          for (let index = 0; index < 20; index++) {
            var stat = message.data.data[index].attributes.status;

            switch (stat) {
              case "current":
                current++;
                break;
              case "planned":
                planned++;

                break;
              case "completed":
                completed++;

                break;
              case "on_hold":
                onhold++;

                break;
              case "dropped":
                dropped++;

                break;

              default:
                break;
            }
            // console.log(current, planned, completed, onhold, dropped, total)
           
          }
          var most = myArrayMax([current, planned, completed, onhold, dropped])
          console.log(most);
          res.render("index.ejs", {
            avatar: avatar,
            iden: idd,
            gendie: gen,
            gn: g,
            lover: lover,
            current: current,
            planned: planned,
            completed: completed,
            onhold: onhold,
            dropped: dropped,
            total: total,
            most: most,
          });
        })
        .catch((error) => {
          console.log("STARS");
        });
     
    })
    .catch((error) => {
      console.log(error);
    });
});
function myArrayMax(arr) {
  let len = arr.length;
  let max = -Infinity;
  while (len--) {
    if (arr[len] > max) {
      max = arr[len];
    }
  }
  return max;
}
app.listen(port, () => {
  console.log(`Woopies, I forgot to make this listen on good ol' ${port}!`);
});
