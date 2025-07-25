/*
REcieve request from frontend adn format json required for pdf generation
*/
const http = require("http");
const WebSocketServer = require("websocket").server;
const jsreport = require("jsreport")();
// creating server
const server = http.createServer((req, res) => {
  res.write("Hello World!");
  res.end();
});
//assign server port
server.listen(1010, async () => {
  console.log("server is listening at port: " + server.address().port);
});

const elasticsearch = require("elasticsearch");
const client = new elasticsearch.Client({
  host: "http://192.168.10.159:9200",

  // host: "http://192.168.101.4:9200",
  apiVersion: "5.6", // use the same version of your Elasticsearch instance
});

var queue = [];
var counter = true;
var flag = 0;
var type = ""
const fs = require("fs");
var final_json = {
  path: "",
  key: "",
};

report_json = {}

var dirpath = "C:/Users/Administrator/Desktop/naya sahsa/dubai/tiktok_report/";
// var dirpath = "";
// var dirpath="";

var filepath = "report1.pdf";
var template_json = {
  shortid: "RwbNn_axpm",
};
//websocket creation for continuius data receving and sending
const wsServer = new WebSocketServer({
  httpServer: server,
  maxReceivedFrameSize: 9999999,
  maxReceivedMessageSize: 15 * 1024 * 1024,
  autoAcceptConnections: false,
});
//listening req on server port
wsServer.on("request", function (request) {
  const connection = request.accept(null, request.origin);
  connection.on("message", function (req) {
    var request = JSON.parse(req.utf8Data);
    if (queue.length == 0) {
      queue.push(request);
      if (counter) {
        checkQueue();
      }
    }
    else {
      var count = 0;
      for (var q = 0; q < queue.length; q++) {
        if (queue[q].currentseed == request.currentseed) {
          count++;
        }
      }
      if (count == 0) {
        queue.push(request);
      }
    }
    var reponseinterval = setInterval(() => {
      if (counter) {
        queue.shift();
        connection.sendUTF(JSON.stringify(final_json));
        if (queue.length === 0) {
          clearInterval(reponseinterval);
        } else {
          if (counter) {
            checkQueue();
          }
        }
      } else {
        connection.sendUTF(JSON.stringify({ status: "Generating Report" }));
      }
    }, 3000);
  });
});
const checkQueue = function () {
  console.log(queue);
  var req = queue[0];
  gatheringdata(req);
};
// format data recevied from  frontend and format according to required format for pdf generation
gatheringdata = async function (request) {
  counter = false;
  filepath = request.currentseed + ".pdf";
  final_json.path = "/tiktok_report/" + filepath;
  final_json.key = request.currentseed;


  if(request.system) {
    report_json["system"] = request.system;
  } else {
    report_json["system"] = "osint";
  }
  report_json["hashtag"] = request.hashtag;
  report_json["type"] = "hashtag";
  report_json["visage"] = request.visageContact;
  report_json["currentseed"] = request.currentseed;

  // let str_ = JSON.stringify(request)
  // let data_ = str_.replace(/node2./g,'')
  // data_ = JSON.parse(data_)
  // data_["type"] = "profile";
  // fs.openSync(dirpath + "lastjson_profile2.json", "w");
  // fs.writeFileSync(dirpath + "lastjson_profile2.json", JSON.stringify(data_));

  if (request.type === "hashtag") {
    type = "hashtag"
    Promise.all([get_contributors(request.hashtag, request.contributors_size, request.contributorCountries),
      get_videos(request.hashtag, request.videos_size), get_analytics(request.hashtag, 100),
      get_about(request.hashtag, 100), get_contri_contributors(request.hashtag, 100)])
      .then(x => {
        setTimeout(() => {
          console.log("all done ***********************************************")

          try {
            report_json.posts.hits.hits.forEach(x=>{
              x._source.comments_data = []
            })
          } catch (error) {
            // do nothing
          }

          try {
            if(report_json.contributors) {
              report_json.contributors.sort(function(a,b){
                return b._source.total_videos-a._source.total_videos;
              });
            }
          } catch (error) {
            // do nothing
          }


          fs.openSync(dirpath + "lastjson_hashtag.json", "w");
          fs.writeFileSync(dirpath + "lastjson_hashtag.json", JSON.stringify(report_json));

          generatereport(report_json, template_json)
        }, 3000);
    })
  } else {
    // profile
    let str_ = JSON.stringify(request)
    let data_ = str_.replace(/node2./g,'')
    data_ = JSON.parse(data_)
    data_["type"] = "profile";
    data_["visage"] = request.visagecontactvisibility;
    try {
      data_.contributors = data_.contributors.hits.hits;
    } catch (error) {
    }
    try {
      data_.country_contributor.categories = data_.country_contributor.categories.map(x=>x.country_name)
      data_.country_follower.categories = data_.country_follower.categories.map(x=>x.country_name)
      data_.country_following.categories = data_.country_following.categories.map(x=>x.country_name)
    } catch (error) {
      // do nothing
    }


    if(data_.contributors) {
      try {
        data_.contributors.sort(function(a,b){
          return b._source.total_videos-a._source.total_videos;
        });
      } catch(error) {
        // do nothing
      }
    }

    fs.openSync(dirpath + "lastjson_profile.json", "w");
    fs.writeFileSync(dirpath + "lastjson_profile.json", JSON.stringify(data_));
    generatereport(data_, template_json)
  }
};


//generate pdf for inpout data
function generatereport(data, template) {
  // console.log("verify data", data)
  console.log("Start generating");

  jsreport
    .render({
      template: template,
      data: data,
    })
    .then(function (res) {
      counter = true;
      // fs.unlinkSync(dirpath+filepath);
      fs.openSync(dirpath + filepath, "w");
      var read = fs.createWriteStream(dirpath + filepath);
      res.stream.pipe(read);
    });
}

// starting jsreport service
jsreport.init()
.then(()=>{
    // running
})
.catch((e)=>{
    console.log(e.stack);
    process.exit(1);
})

async function get_contributors(hashtag, size, countries_list) {
  if(size=="all") {
    size = 2000;
  }
  if(!size) {
    report_json["contributors"] = [];
    return;
  }

  await new Promise(async (resolve, reject) => {
    let should_clauses = []
    countries_list.forEach(function(code){
      should_clauses.push({"prefix": {"phone_number": code}})
    })
    client.search({
      index: 'tiktok',
      type: 'contributors',
      size: size,
      body: {
        "sort": [
          {
            "total_videos": {
              "order": "desc"
            }
          }
        ],
        "query": {
          "bool": {
            "must": [
              { "match": { "exists_in_db": true } },
              { "match": { "from_hashtag": hashtag } },
              {
                "bool": {
                  "should": should_clauses,
                  "minimum_should_match": 1
                }
              }
            ]
          }
        }
      }
    }).then(response=>{
      // console.log("response contributors",response)
      if (response.hits.hits.length > 0) {
        var d = response.hits.hits;
        report_json["contributors"] = d;
      } else {
        report_json["contributors"] = [];
      }
      return resolve(true);
    });
  })
}
async function get_videos (hashtag, size) {
  if(size=="all") {
    size = 2000;
  }
  if(!size) {
    size = 0;
    report_json["videos"] = [];
    return;
  }
  await new Promise(async (res, rej) => {
    client.search({
      index: 'tiktok',
      type: 'hashtag_videos',
      size: size,
      body: {
        "query": {
          "bool": {
            "must": [{
              "match": {
                "from_hashtag": hashtag
              }
            }]
          }
        }
      }
    }).then(response=>{
      // console.log("response videos",response)
      if (response.hits.hits.length > 0) {
        var d = response.hits.hits;
        report_json["videos"] = d;
      } else {
        report_json["videos"] = [];
      }
      return res(true);
    })
  })
}
async function get_analytics (hashtag, size) {
 await new Promise(async (res, rej) => {
    client.search({
      index: 'tiktok',
      type: 'hashtag_analytics',
      body: {
        "query": {
          "bool": {
            "must": [{
              "match": {
                "_id": hashtag
              }
            }]
          }
        }
      }
    }).then(response=>{
      // console.log("response analytics",response)
      if (response.hits.hits.length > 0) {
        var d = response.hits.hits;
        report_json["analytics"] = d;
      } else {
        report_json["analytics"] = [];
      }
      return res(true);
    })
  })
}
async function get_about (hashtag, size) {
  await new Promise(async (res, rej) => {
    client.search({
      index: 'about',
      type: 'tiktok_hashtag',
      body: {
        "query": {
          "bool": {
            "must": [{
              "match": {
                "hashtag": hashtag.replace('#', '')
              }
            }]
          }
        }
      }
    }).then(response=>{
      // console.log("response about",response)
      if (response.hits.hits.length > 0) {
        var d = response.hits.hits;
        report_json["about"] = d;
      } else {
        report_json["about"] = [];
      }
      return res(true);
    })
  })
}
async function get_contri_contributors (hashtag, size) {
  await new Promise(async (res, rej) => {
    client.search({
      index: 'tiktok_pro_con',
      type: 'Contributors',
      body: {
        "query": {
          "bool": {
            "must": [{
              "match": {
                "_id": hashtag
              }
            }]
          }
        }
      }
    }).then(response=>{
      // console.log("response contribu",response)
      if (response.hits.hits.length > 0) {
        var d = response.hits.hits;
         let cat = d[0]._source.categories.map(x=>{
            return x.country_name
        });
        report_json["country_contributor"] = {categories: cat, series: d[0]._source.series}
      } else {
        report_json["country_contributor"] = [];
      }
      return res(true);
    })
  })
}