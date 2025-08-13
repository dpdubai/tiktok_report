function toJSON(data) {
    return JSON.stringify(data);
}

function proxify(src,path='image_api') {
    var new_src='https://dubai.osintcenter.org/'+path+'?url=';
    if(src) {
        new_src = new_src + encodeURIComponent(src);
    }

    return new_src;
}

Handlebars.registerHelper({
    and() {
        return Array.prototype.every.call(arguments, Boolean);
    },
    or() {
        return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
}})

Handlebars.registerHelper('if_noteq', function(a, b, opts) {
    a=a+1;
    if(a != b) // Or === depending on your needs
        return opts.fn(this);
    else
        return opts.inverse(this);
});
Handlebars.registerHelper('resolveImg', function(a, opts) {
    if(!a) {
        return a;
    }
    else {
      if(a.includes('~')) {
        let arr = a.split('~');
        a = arr[0] + "~" + arr.slice(-1);
      }
    }
    let finalUrl = proxify(a);
    return finalUrl;
});

Handlebars.registerHelper('parse_int', function(a){
    var COUNT_FORMATS = [
      {
        // 0 - 999
        letter: "",
        limit: 1e3,
      },
      {
        // 1,000 - 999,999
        letter: "K",
        limit: 1e6,
      },
      {
        // 1,000,000 - 999,999,999
        letter: "M",
        limit: 1e9,
      },
      {
        // 1,000,000,000 - 999,999,999,999
        letter: "B",
        limit: 1e12,
      },
      {
        // 1,000,000,000,000 - 999,999,999,999,999
        letter: "T",
        limit: 1e15,
      },
    ];
    if (a) {
      const format = COUNT_FORMATS.find((format) => a < format.limit);
      a = (1000 * a) / format.limit;
      a = Math.round(a * 10) / 10; // keep one decimal number, only if needed
      return a + format.letter;
    } else {
      return 0;
    }
});

Handlebars.registerHelper('len', function(a){
    let length = (a)?a:'0';
    return new Handlebars.SafeString(length);
});

Handlebars.registerHelper('all_len', function(a){
    let arr = a.reduce((a,b)=>a+b,0)
    let length = (arr)?arr:'0';
    return new Handlebars.SafeString(length);
});

Handlebars.registerHelper('if_end',function(a,first_page,all,opts){

    // conditional flag
    let flag = false;

    if(a+1 <= first_page) {
        flag = a+1==first_page
    } else {
        flag = first_page===all?(a+1)%all==0:((a+first_page-(all-first_page))%all==0)
    }
    return flag?opts.fn(this):opts.inverse(this);
});

Handlebars.registerHelper('if_lt', function(a, b, opts) {
    if(a < b) // Or === depending on your needs
        return opts.fn(this);
    else
        return opts.inverse(this);
});

Handlebars.registerHelper('replace', function(a, b, c, opts) {
  if(a) {
    return new Handlebars.SafeString(a.replace(b,c))
  } else {
    return a;
  }
});

Handlebars.registerHelper('includes', function(a, b, opts) {
    if(a.includes(b)) {
      return opts.fn(this);
    } else {
      return opts.inverse(this);
    }
});

Handlebars.registerHelper('if_eq', function(a, b, opts) {
    if(a == b) // Or === depending on your needs
        return opts.fn(this);
    else
        return opts.inverse(this);
});

Handlebars.registerHelper('sum', function () {
  return Array.prototype.slice.call(arguments, 0, -1).reduce((acc, num) => acc += (num)?num:0);
});

Handlebars.registerHelper('add', function(a,b){
    return a+b;
})

Handlebars.registerHelper('isDivisor', function (num1, num2) {
    num2=num2+1;
	return num2 !== 0  && num2 % num1 === 0;
});

function getPageNumber(pageIndex) {
    if (pageIndex == null) {
        return '';
    }

    const pageNumber = pageIndex + 1;

    return pageNumber;
}

function getTotalPages(pages) {
    if (!pages) {
        return '';
    }

    return pages.length;
}

Handlebars.registerHelper('fall_back', function(a,b) {
    
    return new Handlebars.SafeString(a || b)
});

Handlebars.registerHelper('fallback', function(a) {
    
    return new Handlebars.SafeString(a || 'N/A')
});

Handlebars.registerHelper('parseString', function(a) {
    try {
        a = JSON.parse('"'+a+'"')
    }
    catch(erro) {
        // do nothing
    }
    return new Handlebars.SafeString(a)
});

Handlebars.registerHelper('concat', function(a,b) {
    return new Handlebars.SafeString(a + "" + b)
});

Handlebars.registerHelper('trim', function(passedString,n) {
    var theString=passedString;
    if(passedString.length>n){  
    theString = passedString.substring(0,n)+"..";
    }
    return new Handlebars.SafeString(theString)
});
Handlebars.registerHelper('trimString', function(passedString) {
    var theString=passedString;
    if(passedString.length>30){  
    theString = passedString.substring(0,30)+"..";
    }
    return new Handlebars.SafeString(theString)
});

Handlebars.registerHelper('trimStringC', function(a,b) {
    var theString=a+b;
    if(theString.length>38){  
    theString = (a+b).substring(0,38)+"..";
    }
    return new Handlebars.SafeString(theString)
});



Handlebars.registerHelper('formatTime', function(timeString){
    return new Handlebars.SafeString(timeString.split("T").join(" "));
})

Handlebars.registerHelper('trimName', function(passedString) {
    var theString = passedString.substring(0,18)+"..";
    return new Handlebars.SafeString(theString)
});

Handlebars.registerHelper('if_orrr', function(a, b, d, e, f, g,h,i,j,k,l,m,n,o,p, opts) {
    if (a || b ||  d || e || f || g || h || i || j || k || l || m || n || o || p) // Or === depending on your needs
        return opts.fn(this);
    else
        return opts.inverse(this);
});

function getlatesttime(){
    var today = new Date();
    return today.toLocaleTimeString('en');
}

function getlatestdate(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    return today;
}

Handlebars.registerHelper('slice', function(str, a, b){
    str = str || ""
    a = a || ""
    b = b || ""
    return new Handlebars.SafeString(str.slice(a,b))
})

Handlebars.registerHelper('url', function(url){
  if(url) {
    url = url.includes('http')?url:'https://'+url;
  }
  return new Handlebars.SafeString(url)
})

Handlebars.registerHelper('genUrl', function(number){
  if(typeof number === Object) {
    number = number[0];
  }
  number = number + '';
    if (number.includes('+')) {
      number = number.slice(1);
    }
    var flag = ""
    if(number){
  for (var i = 1; i < 5; i++) {
      var code = number.substring(0, i);
      let c = numberCountries.find(x=>x.c.includes(code))
      if(c) {
          flag = c;
      }
   
    }
    }
  

    if(flag && flag.i) {
        // return new Handlebars.SafeString('https://ipdata.co/flags/'+flag.i+'.png')
        let finalUrl = proxify('https://www.worldatlas.com/r/w40/img/flag/'+flag.i+'-flag.jpg','flag_api');
        return new Handlebars.SafeString(finalUrl)
    } else {
        return new Handlebars.SafeString('')
    }
})



numberCountries = [
  {
    n: "Saint Barthélemy",
    i: "bl",
    c: ["590"],
    lat: "17.9000",
    lng: "62.8333",
  },
  {
    n: "Afghanistan",
    i: "af",
    c: ["93"],
    lat: "33.93911",
    lng: "67.709953",
  },
  {
    n: "Albania",
    i: "al",
    c: ["355"],
    lat: "41.153332",
    lng: "20.168331",
  },
  {
    n: "Algeria",
    i: "dz",
    c: ["213"],
    lat: "28.033886",
    lng: "1.659626",
  },
  {
    n: "American Samoa",
    i: "as",
    c: ["1684"],
    lat: "-14.270972",
    lng: "-170.132217",
  },
  {
    n: "Andorra",
    i: "ad",
    c: ["376"],
    lat: "42.546245",
    lng: "1.601554",
  },
  {
    n: "Angola",
    i: "ao",
    c: ["244"],
    lat: "-11.202692",
    lng: "17.873887",
  },
  {
    n: "Anguilla",
    i: "ai",
    c: ["1264"],
    lat: "18.220554",
    lng: "-63.068615",
  },
  {
    n: "Antarctica",
    i: "nf",
    c: ["672"],
    lat: "-75.250973",
    lng: "-0.071389",
  },
  {
    n: "Antigua and Barbuda",
    i: "ag",
    c: ["1268"],
    lat: "17.060816",
    lng: "-61.796428",
  },
  {
    n: "Argentina",
    i: "ar",
    c: ["54"],
    lat: "-38.416097",
    lng: "-63.616672",
  },
  {
    n: "Armenia",
    i: "am",
    c: ["374"],
    lat: "40.069099",
    lng: "45.038189",
  },
  {
    n: "Aruba",
    i: "aw",
    c: ["297"],
    lat: "12.52111",
    lng: "-69.968338",
  },
  {
    n: "Australia",
    i: "au",
    c: ["61"],
    lat: "-25.274398",
    lng: "133.775136",
  },
  {
    n: "Austria",
    i: "at",
    c: ["43"],
    lat: "47.516231",
    lng: "14.550072",
  },
  {
    n: "Azerbaijan",
    i: "az",
    c: ["994"],
    lat: "40.143105",
    lng: "47.576927",
  },
  {
    n: "Bahamas",
    i: "bs",
    c: ["1242"],
    lat: "25.03428",
    lng: "-77.39628",
  },
  {
    n: "Bahrain",
    i: "bh",
    c: ["973"],
    lat: "25.930414",
    lng: "50.637772",
  },
  {
    n: "Bangladesh",
    i: "bd",
    c: ["880"],
    lat: "23.684994",
    lng: "90.356331",
  },
  {
    n: "Barbados",
    i: "bb",
    c: ["1246"],
    lat: "13.193887",
    lng: "-59.543198",
  },
  {
    n: "Belarus",
    i: "by",
    c: ["375"],
    lat: "53.709807",
    lng: "27.953389",
  },
  {
    n: "Belgium",
    i: "be",
    c: ["32"],
    lat: "50.503887",
    lng: "4.469936",
  },
  {
    n: "Belize",
    i: "bz",
    c: ["501"],
    lat: "17.189877",
    lng: "-88.49765",
  },
  {
    n: "Benin",
    i: "bj",
    c: ["229"],
    lat: "9.30769",
    lng: "2.315834",
  },
  {
    n: "Bermuda",
    i: "bm",
    c: ["1441"],
    lat: "32.321384",
    lng: "-64.75737",
  },
  {
    n: "Bhutan",
    i: "bt",
    c: ["975"],
    lat: "27.514162",
    lng: "90.433601",
  },
  {
    n: "Bolivia",
    i: "bo",
    c: ["591"],
    lat: "-16.290154",
    lng: "-63.588653",
  },
  {
    n: "Bosnia and Herzegovina",
    i: "ba",
    c: ["387"],
    lat: "43.915886",
    lng: "17.679076",
  },
  {
    n: "Botswana",
    i: "bw",
    c: ["267"],
    lat: "-22.328474",
    lng: "24.684866",
  },
  {
    n: "Brazil",
    i: "br",
    c: ["55"],
    lat: "-14.235004",
    lng: "-51.92528",
  },
  {
    n: "British Indian Ocean Territory",
    i: "io",
    c: ["246"],
    lat: "-6.343194",
    lng: "71.876519",
  },
  {
    n: "British Virgin Islands",
    i: "vg",
    c: ["1284"],
    lat: "18.420695",
    lng: "-64.639968",
  },
  {
    n: "Brunei",
    i: "bn",
    c: ["673"],
    lat: "4.535277",
    lng: "114.727669",
  },
  {
    n: "Bulgaria",
    i: "bg",
    c: ["359"],
    lat: "42.733883",
    lng: "25.48583",
  },
  {
    n: "Burkina Faso",
    i: "bf",
    c: ["226"],
    lat: "12.238333",
    lng: "-1.561593",
  },
  {
    n: "Burundi",
    i: "bi",
    c: ["257"],
    lat: "-3.373056",
    lng: "29.918886",
  },
  {
    n: "Cambodia",
    i: "kh",
    c: ["855"],
    lat: "12.565679",
    lng: "104.990963",
  },
  {
    n: "Cameroon",
    i: "cm",
    c: ["237"],
    lat: "7.369722",
    lng: "12.354722",
  },
  {
    n: "Canada",
    i: "ca",
    c: [
      "1403",
      "1587",
      "1780",
      "1250",
      "1604",
      "1778",
      "1204",
      "1506",
      "1709",
      "1902",
      "1226",
      "1249",
      "1289",
      "1343",
      "1416",
      "1519",
      "1613",
      "1647",
      "1705",
      "1807",
      "1905",
      "1418",
      "1438",
      "1450",
      "1514",
      "1579",
      "1581",
      "1819",
      "1306",
      "1867",
    ],
    lat: "56.130366",
    lng: "-106.346771",
  },
  {
    n: "Cape Verde",
    i: "cv",
    c: ["238"],
    lat: "16.002082",
    lng: "-24.013197",
  },
  {
    n: "Cayman Islands",
    i: "ky",
    c: ["1345"],
    lat: "19.513469",
    lng: "-80.566956",
  },
  {
    n: "Central African Republic",
    i: "cf",
    c: ["236"],
    lat: "6.611111",
    lng: "20.939444",
  },
  {
    n: "Chad",
    i: "td",
    c: ["235"],
    lat: "15.454166",
    lng: "18.732207",
  },
  {
    n: "Chile",
    i: "cl",
    c: ["56"],
    lat: "-35.675147",
    lng: "-71.542969",
  },
  {
    n: "China",
    i: "cn",
    c: ["86"],
    lat: "35.86166",
    lng: "104.195397",
  },
  {
    n: "Ascension Island",
    i: "ac",
    c: ["247"],
    lat: "7.9467",
    lng: "14.3559",
  },
  {
    n: "Antarctica",
    i: "aq",
    c: ["672"],
    lat: "82.8628",
    lng: "135.0000",
  },
  {
    n: "Christmas Island",
    i: "cx",
    c: ["6189"],
    lat: "-10.447525",
    lng: "105.690449",
  },
  {
    n: "Clipperton Island",
    i: "cp",
    c: ["247"],
    lat: "10.2833",
    lng: "109.2167",
  },
  {
    n: "Canary Islands",
    i: "ic",
    c: ["34"],
    lat: "28.2916",
    lng: "16.6291",
  },
  {
    n: "Bonaire, Saint Eustatius And Saba",
    i: "bq",
    c: ["599"],
    lat: "12.1784",
    lng: "68.2385",
  },
  {
    n: "Bouvet Island",
    i: "bv",
    c: ["47"],
    lat: "54.4208",
    lng: "3.3464",
  },
  {
    n: "Colombia",
    i: "co",
    c: ["57"],
    lat: "4.570868",
    lng: "-74.297333",
  },
  {
    n: "Comoros",
    i: "km",
    c: ["269"],
    lat: "-11.875001",
    lng: "43.872219",
  },
  {
    n: "Cook Islands",
    i: "ck",
    c: ["682"],
    lat: "-21.236736",
    lng: "-159.777671",
  },
  {
    n: "Costa Rica",
    i: "cr",
    c: ["506"],
    lat: "9.748917",
    lng: "-83.753428",
  },
  {
    n: "Croatia",
    i: "hr",
    c: ["385"],
    lat: "45.1",
    lng: "15.2",
  },
  {
    n: "Cuba",
    i: "cu",
    c: ["53"],
    lat: "21.521757",
    lng: "-77.781167",
  },
  {
    n: "Cyprus",
    i: "cy",
    c: ["357"],
    lat: "35.126413",
    lng: "33.429859",
  },
  {
    n: "Czech Republic",
    i: "cz",
    c: ["420"],
    lat: "49.817492",
    lng: "15.472962",
  },
  {
    n: "Denmark",
    i: "dk",
    c: ["45"],
    lat: "56.26392",
    lng: "9.501785",
  },
  {
    n: "Djibouti",
    i: "dj",
    c: ["253"],
    lat: "11.825138",
    lng: "42.590275",
  },
  {
    n: "Dominica",
    i: "dm",
    c: ["1767"],
    lat: "15.414999",
    lng: "-61.370976",
  },
  {
    n: "Dominican Republic",
    i: "do",
    c: ["1849"],
    lat: "18.735693",
    lng: "-70.162651",
  },
  {
    n: "Ecuador",
    i: "ec",
    c: ["593"],
    lat: "-1.831239",
    lng: "-78.183406",
  },
  {
    n: "Diego Garcia",
    i: "dg",
    c: ["246"],
    lat: "7.3195",
    lng: "72.4229",
  },
  {
    n: "Democratic Republic Of Congo",
    i: "cd",
    c: ["243"],
    lat: "4.0383",
    lng: "21.7587",
  },
  {
    n: "Cocos (Keeling) Islands",
    i: "cd",
    c: ["61"],
    lat: "12.1642",
    lng: "96.8710",
  },
  {
    n: "Egypt",
    i: "eg",
    c: ["20"],
    lat: "26.820553",
    lng: "30.802498",
  },
  {
    n: "El Salvador",
    i: "sv",
    c: ["503"],
    lat: "13.794185",
    lng: "-88.89653",
  },
  {
    n: "Equatorial Guinea",
    i: "gq",
    c: ["240"],
    lat: "1.650801",
    lng: "10.267895",
  },
  {
    n: "Eritrea",
    i: "er",
    c: ["291"],
    lat: "15.179384",
    lng: "39.782334",
  },
  {
    n: "Estonia",
    i: "ee",
    c: ["372"],
    lat: "58.595272",
    lng: "25.013607",
  },
  {
    n: "Ethiopia",
    i: "et",
    c: ["251"],
    lat: "9.145",
    lng: "40.489673",
  },
  {
    n: "Faroe Islands",
    i: "fo",
    c: ["298"],
    lat: "61.892635",
    lng: "-6.911806",
  },
  {
    n: "Fiji",
    i: "fj",
    c: ["679"],
    lat: "-16.578193",
    lng: "179.414413",
  },
  {
    n: "Finland",
    i: "fi",
    c: ["358"],
    lat: "61.92411",
    lng: "25.748151",
  },
  {
    n: "France",
    i: "fr",
    c: ["33"],
    lat: "46.227638",
    lng: "2.213749",
  },
  {
    n: "French Guiana",
    i: "gf",
    c: ["594"],
    lat: "3.933889",
    lng: "-53.125782",
  },
  {
    n: "French Polynesia",
    i: "pf",
    c: ["689"],
    lat: "-17.679742",
    lng: "-149.406843",
  },
  {
    n: "Gabon",
    i: "ga",
    c: ["241"],
    lat: "-0.803689",
    lng: "11.609444",
  },
  {
    n: "Gambia",
    i: "gm",
    c: ["220"],
    lat: "13.443182",
    lng: "-15.310139",
  },
  {
    n: "Georgia",
    i: "ge",
    c: ["995"],
    lat: "42.315407",
    lng: "43.356892",
  },
  {
    n: "Germany",
    i: "de",
    c: ["49"],
    lat: "51.165691",
    lng: "10.451526",
  },
  {
    n: "Ghana",
    i: "gh",
    c: ["233"],
    lat: "7.946527",
    lng: "-1.023194",
  },
  {
    n: "Gibraltar",
    i: "gi",
    c: ["350"],
    lat: "36.137741",
    lng: "-5.345374",
  },
  {
    n: "Greece",
    i: "gr",
    c: ["30"],
    lat: "39.074208",
    lng: "21.824312",
  },
  {
    n: "Greenland",
    i: "gl",
    c: ["299"],
    lat: "71.706936",
    lng: "-42.604303",
  },
  {
    n: "Grenada",
    i: "gd",
    c: ["1473"],
    lat: "12.262776",
    lng: "-61.604171",
  },
  {
    n: "Guadeloupe",
    i: "gp",
    c: ["590"],
    lat: "16.995971",
    lng: "-62.067641",
  },
  {
    n: "Guam",
    i: "gu",
    c: ["1671"],
    lat: "13.444304",
    lng: "144.793731",
  },
  {
    n: "Guatemala",
    i: "gt",
    c: ["502"],
    lat: "15.783471",
    lng: "-90.230759",
  },
  {
    n: "Guinea",
    i: "gn",
    c: ["224"],
    lat: "9.945587",
    lng: "-9.696645",
  },
  {
    n: "Guinea-Bissau",
    i: "gw",
    c: ["245"],
    lat: "11.803749",
    lng: "-15.180413",
  },
  {
    n: "Guyana",
    i: "gy",
    c: ["592"],
    lat: "4.860416",
    lng: "-58.93018",
  },
  {
    n: "Haiti",
    i: "ht",
    c: ["509"],
    lat: "18.971187",
    lng: "-72.285215",
  },
  {
    n: "Honduras",
    i: "hn",
    c: ["504"],
    lat: "15.199999",
    lng: "-86.241905",
  },
  {
    n: "Hong Kong",
    i: "hk",
    c: ["852"],
    lat: "22.396428",
    lng: "114.109497",
  },
  {
    n: "Hungary",
    i: "hu",
    c: ["36"],
    lat: "47.162494",
    lng: "19.503304",
  },
  {
    n: "Iceland",
    i: "is",
    c: ["354"],
    lat: "64.963051",
    lng: "-19.020835",
  },
  {
    n: "India",
    i: "in",
    c: ["91"],
    lat: "20.593684",
    lng: "78.96288",
  },
  {
    n: "Indonesia",
    i: "id",
    c: ["62"],
    lat: "-0.789275",
    lng: "113.921327",
  },
  {
    n: "Iran",
    i: "ir",
    c: ["98"],
    lat: "32.427908",
    lng: "53.688046",
  },
  {
    n: "Iraq",
    i: "iq",
    c: ["964"],
    lat: "33.223191",
    lng: "43.679291",
  },
  {
    n: "Ireland",
    i: "ie",
    c: ["353"],
    lat: "53.41291",
    lng: "-8.24389",
  },
  {
    n: "Israel",
    i: "il",
    c: ["972"],
    lat: "31.046051",
    lng: "34.851612",
  },
  {
    n: "Italy",
    i: "it",
    c: ["39"],
    lat: "41.87194",
    lng: "12.56738",
  },
  {
    n: "Jamaica",
    i: "jm",
    c: ["1876"],
    lat: "18.109581",
    lng: "-77.297508",
  },
  {
    n: "Japan",
    i: "jp",
    c: ["81"],
    lat: "36.204824",
    lng: "138.252924",
  },
  {
    n: "Jordan",
    i: "jo",
    c: ["962"],
    lat: "30.585164",
    lng: "36.238414",
  },
  {
    n: "Kazakhstan",
    i: "kz",
    c: [
      "733622",
      "76",
      "7700",
      "7701",
      "7702",
      "7703",
      "7704",
      "7705",
      "7706",
      "7707",
      "7708",
      "7709",
      "7710",
      "7711",
      "7712",
      "7713",
      "7714",
      "7715",
      "7716",
      "7717",
      "7718",
      "7719",
      "7720",
      "7721",
      "7722",
      "7723",
      "7724",
      "7725",
      "7726",
      "7727",
      "7728",
      "7729",
      "7730",
      "7731",
      "7732",
      "7733",
      "7734",
      "7735",
      "7736",
      "7737",
      "7738",
      "7739",
      "7740",
      "7741",
      "7742",
      "7743",
      "7744",
      "7745",
      "7746",
      "7747",
      "7748",
      "7749",
      "7750",
      "7751",
      "7752",
      "7753",
      "7754",
      "7755",
      "7756",
      "7757",
      "7758",
      "7759",
      "7760",
      "7761",
      "7762",
      "7763",
      "7764",
      "7765",
      "7766",
      "7767",
      "7768",
      "7769",
      "7770",
      "7771",
      "7772",
      "7773",
      "7774",
      "7775",
      "7776",
      "7777",
      "7778",
      "7779",
      "7780",
      "7781",
      "7782",
      "7783",
      "7784",
      "7785",
      "7786",
      "7787",
      "7788",
      "7789",
      "7790",
      "7791",
      "7792",
      "7793",
      "7794",
      "7795",
      "7796",
      "7797",
      "7798",
      "7799",
    ],
    lat: "48.019573",
    lng: "66.923684",
  },
  {
    n: "Kenya",
    i: "ke",
    c: ["254"],
    lat: "-0.023559",
    lng: "37.906193",
  },
  {
    n: "Kiribati",
    i: "ki",
    c: ["686"],
    lat: "-3.370417",
    lng: "-168.734039",
  },
  {
    n: "Kuwait",
    i: "kw",
    c: ["965"],
    lat: "29.31166",
    lng: "47.481766",
  },
  {
    n: "Kyrgyzstan",
    i: "kg",
    c: ["996"],
    lat: "41.20438",
    lng: "74.766098",
  },
  {
    n: "Laos",
    i: "la",
    c: ["856"],
    lat: "19.85627",
    lng: "102.495496",
  },
  {
    n: "Latvia",
    i: "lv",
    c: ["371"],
    lat: "56.879635",
    lng: "24.603189",
  },
  {
    n: "Lebanon",
    i: "lb",
    c: ["961"],
    lat: "33.854721",
    lng: "35.862285",
  },
  {
    n: "Lesotho",
    i: "ls",
    c: ["266"],
    lat: "-29.609988",
    lng: "28.233608",
  },
  {
    n: "Liberia",
    i: "lr",
    c: ["231"],
    lat: "6.428055",
    lng: "-9.429499",
  },
  {
    n: "Libya",
    i: "ly",
    c: ["218"],
    lat: "26.3351",
    lng: "17.228331",
  },
  {
    n: "Liechtenstein",
    i: "li",
    c: ["423"],
    lat: "47.166",
    lng: "9.555373",
  },
  {
    n: "Lithuania",
    i: "lt",
    c: ["370"],
    lat: "55.169438",
    lng: "23.881275",
  },
  {
    n: "Luxembourg",
    i: "lu",
    c: ["352"],
    lat: "49.815273",
    lng: "6.129583",
  },
  {
    n: "Macau",
    i: "mo",
    c: ["853"],
    lat: "22.198745",
    lng: "113.543873",
  },
  {
    n: "Madagascar",
    i: "mg",
    c: ["261"],
    lat: "-18.766947",
    lng: "46.869107",
  },
  {
    n: "Malawi",
    i: "mw",
    c: ["265"],
    lat: "-13.254308",
    lng: "34.301525",
  },
  {
    n: "Malaysia",
    i: "my",
    c: ["60"],
    lat: "4.210484",
    lng: "101.975766",
  },
  {
    n: "Maldives",
    i: "mv",
    c: ["960"],
    lat: "3.202778",
    lng: "73.22068",
  },
  {
    n: "Mali",
    i: "ml",
    c: ["223"],
    lat: "17.570692",
    lng: "-3.996166",
  },
  {
    n: "Malta",
    i: "mt",
    c: ["356"],
    lat: "35.937496",
    lng: "14.375416",
  },
  {
    n: "Marshall Islands",
    i: "mh",
    c: ["692"],
    lat: "7.131474",
    lng: "171.184478",
  },
  {
    n: "Martinique",
    i: "mq",
    c: ["596"],
    lat: "14.641528",
    lng: "-61.024174",
  },
  {
    n: "Mauritania",
    i: "mr",
    c: ["222"],
    lat: "21.00789",
    lng: "-10.940835",
  },
  {
    n: "Mauritius",
    i: "mu",
    c: ["230"],
    lat: "-20.348404",
    lng: "57.552152",
  },
  {
    n: "Mayotte",
    i: "yt",
    c: ["262"],
    lat: "-12.8275",
    lng: "45.166244",
  },
  {
    n: "Mexico",
    i: "mx",
    c: ["52"],
    lat: "23.634501",
    lng: "-102.552784",
  },
  {
    n: "Moldova",
    i: "md",
    c: ["373"],
    lat: "47.411631",
    lng: "28.369885",
  },
  {
    n: "Monaco",
    i: "mc",
    c: ["377"],
    lat: "43.750298",
    lng: "7.412841",
  },
  {
    n: "Mongolia",
    i: "mn",
    c: ["976"],
    lat: "46.862496",
    lng: "103.846656",
  },
  {
    n: "Montenegro",
    i: "me",
    c: ["382"],
    lat: "42.708678",
    lng: "19.37439",
  },
  {
    n: "Montserrat",
    i: "ms",
    c: ["1664"],
    lat: "16.742498",
    lng: "-62.187366",
  },
  {
    n: "Morocco",
    i: "ma",
    c: ["212"],
    lat: "31.791702",
    lng: "-7.09262",
  },
  {
    n: "Mozambique",
    i: "mz",
    c: ["258"],
    lat: "-18.665695",
    lng: "35.529562",
  },
  {
    n: "Namibia",
    i: "na",
    c: ["264"],
    lat: "-22.95764",
    lng: "18.49041",
  },
  {
    n: "Nauru",
    i: "nr",
    c: ["674"],
    lat: "-0.522778",
    lng: "166.931503",
  },
  {
    n: "Nepal",
    i: "np",
    c: ["977"],
    lat: "28.394857",
    lng: "84.124008",
  },
  {
    n: "Netherlands",
    i: "nl",
    c: ["31"],
    lat: "52.132633",
    lng: "5.291266",
  },
  {
    n: "New Caledonia",
    i: "nc",
    c: ["687"],
    lat: "-20.904305",
    lng: "165.618042",
  },
  {
    n: "New Zealand",
    i: "nz",
    c: ["64"],
    lat: "-40.900557",
    lng: "174.885971",
  },
  {
    n: "Nicaragua",
    i: "ni",
    c: ["505"],
    lat: "12.865416",
    lng: "-85.207229",
  },
  {
    n: "Niger",
    i: "ne",
    c: ["227"],
    lat: "17.607789",
    lng: "8.081666",
  },
  {
    n: "Nigeria",
    i: "ng",
    c: ["234"],
    lat: "9.081999",
    lng: "8.675277",
  },
  {
    n: "Niue",
    i: "nu",
    c: ["683"],
    lat: "-19.054445",
    lng: "-169.867233",
  },
  {
    n: "North Korea",
    i: "kp",
    c: ["850"],
    lat: "40.339852",
    lng: "127.510093",
  },
  {
    n: "Northern Mariana Islands",
    i: "mp",
    c: ["1670"],
    lat: "17.33083",
    lng: "145.38469",
  },
  {
    n: "Norway",
    i: "no",
    c: ["47"],
    lat: "60.472024",
    lng: "8.468946",
  },
  {
    n: "Oman",
    i: "om",
    c: ["968"],
    lat: "21.512583",
    lng: "55.923255",
  },
  {
    n: "Pakistan",
    i: "pk",
    c: ["92"],
    lat: "30.375321",
    lng: "69.345116",
  },
  {
    n: "Palau",
    i: "pw",
    c: ["680"],
    lat: "7.51498",
    lng: "134.58252",
  },
  {
    n: "Panama",
    i: "pa",
    c: ["507"],
    lat: "8.537981",
    lng: "-80.782127",
  },
  {
    n: "Papua New Guinea",
    i: "pg",
    c: ["675"],
    lat: "-6.314993",
    lng: "143.95555",
  },
  {
    n: "Paraguay",
    i: "py",
    c: ["595"],
    lat: "-23.442503",
    lng: "-58.443832",
  },
  {
    n: "Peru",
    i: "pe",
    c: ["51"],
    lat: "-9.189967",
    lng: "-75.015152",
  },
  {
    n: "Philippines",
    i: "ph",
    c: ["63"],
    lat: "12.879721",
    lng: "121.774017",
  },
  {
    n: "Pitcairn Islands",
    i: "pn",
    c: ["870"],
    lat: "-24.703615",
    lng: "-127.439308",
  },
  {
    n: "Poland",
    i: "pl",
    c: ["48"],
    lat: "51.919438",
    lng: "19.145136",
  },
  {
    n: "Portugal",
    i: "pt",
    c: ["351"],
    lat: "39.399872",
    lng: "-8.224454",
  },
  {
    n: "Puerto Rico",
    i: "pr",
    c: ["1787"],
    lat: "18.220833",
    lng: "-66.590149",
  },
  {
    n: "Qatar",
    i: "qa",
    c: ["974"],
    lat: "25.354826",
    lng: "51.183884",
  },
  {
    n: "European Union",
    i: "eu",
    c: ["388"],
    lat: "53.0000",
    lng: "9.0000",
  },
  {
    n: "French Southern Territories",
    i: "tf",
    c: ["262"],
    lat: "49.2804",
    lng: "69.3486",
  },
  {
    n: "France, Metropolitan",
    i: "fx",
    c: ["241"],
    lat: "48.947548",
    lng: "2.244236",
  },
  {
    n: "Guernsey",
    i: "gg",
    c: ["44"],
    lat: "49.465691",
    lng: "-2.585278",
  },
  {
    n: "Republic Of Congo",
    i: "cg",
    c: ["242"],
    lat: "-0.228021",
    lng: "15.827659",
  },
  {
    n: "heard island and mcdonald islands",
    i: "hm",
    c: ["0"],
    lat: "53.0818",
    lng: "73.5042",
  },
  {
    n: "Isle Of Man",
    i: "im",
    c: ["44"],
    lat: "54.2361",
    lng: "4.5481",
  },
  {
    n: "Micronesia, Federated States Of",
    i: "fm",
    c: ["691"],
    lat: "7.4256",
    lng: "150.5508",
  },
  {
    n: "Romania",
    i: "ro",
    c: ["40"],
    lat: "45.943161",
    lng: "24.96676",
  },
  {
    n: "Russia",
    i: "ru",
    c: ["7"],
    lat: "61.52401",
    lng: "105.318756",
  },
  {
    n: "Rwanda",
    i: "rw",
    c: ["250"],
    lat: "-1.940278",
    lng: "29.873888",
  },
  {
    n: "Réunion",
    i: "re",
    c: ["262"],
    lat: "-21.115141",
    lng: "55.536384",
  },
  {
    n: "Saint Helena",
    i: "sh",
    c: ["290"],
    lat: "-24.143474",
    lng: "-10.030696",
  },
  {
    n: "Saint Kitts and Nevis",
    i: "kn",
    c: ["1869"],
    lat: "17.357822",
    lng: "-62.782998",
  },
  {
    n: "Saint Lucia",
    i: "lc",
    c: ["1758"],
    lat: "13.909444",
    lng: "-60.978893",
  },
  {
    n: "Saint Pierre and Miquelon",
    i: "pm",
    c: ["508"],
    lat: "46.941936",
    lng: "-56.27111",
  },
  {
    n: "Saint Vincent and the Grenadines",
    i: "vc",
    c: ["1784"],
    lat: "12.984305",
    lng: "-61.287228",
  },
  {
    n: "Samoa",
    i: "ws",
    c: ["685"],
    lat: "-13.759029",
    lng: "-172.104629",
  },
  {
    n: "San Marino",
    i: "sm",
    c: ["378"],
    lat: "43.94236",
    lng: "12.457777",
  },
  {
    n: "Saudi Arabia",
    i: "sa",
    c: ["966"],
    lat: "23.885942",
    lng: "45.079162",
  },
  {
    n: "Senegal",
    i: "sn",
    c: ["221"],
    lat: "14.497401",
    lng: "-14.452362",
  },
  {
    n: "Serbia",
    i: "rs",
    c: ["381"],
    lat: "44.016521",
    lng: "21.005859",
  },
  {
    n: "Seychelles",
    i: "sc",
    c: ["248"],
    lat: "-4.679574",
    lng: "55.491977",
  },
  {
    n: "Sierra Leone",
    i: "sl",
    c: ["232"],
    lat: "8.460555",
    lng: "-11.779889",
  },
  {
    n: "Singapore",
    i: "sg",
    c: ["65"],
    lat: "1.352083",
    lng: "103.819836",
  },
  {
    n: "Slovakia",
    i: "sk",
    c: ["421"],
    lat: "48.669026",
    lng: "19.699024",
  },
  {
    n: "Slovenia",
    i: "si",
    c: ["386"],
    lat: "46.151241",
    lng: "14.995463",
  },
  {
    n: "Solomon Islands",
    i: "sb",
    c: ["677"],
    lat: "-9.64571",
    lng: "160.156194",
  },
  {
    n: "Somalia",
    i: "so",
    c: ["252"],
    lat: "5.152149",
    lng: "46.199616",
  },
  {
    n: "Sint Maarten",
    i: "sx",
    c: ["1721"],
    lat: "18.0708",
    lng: "63.0501",
  },
  {
    n: "South Africa",
    i: "za",
    c: ["27"],
    lat: "-30.559482",
    lng: "22.937506",
  },
  {
    n: "South Korea",
    i: "kr",
    c: ["82"],
    lat: "35.907757",
    lng: "127.766922",
  },
  {
    n: "Spain",
    i: "es",
    c: ["34"],
    lat: "40.463667",
    lng: "-3.74922",
  },
  {
    n: "South Georgia And The South Sandwich Islands",
    i: "gs",
    c: ["500"],
    lat: "54.4296",
    lng: "36.5879",
  },
  {
    n: "Sri Lanka",
    i: "lk",
    c: ["94"],
    lat: "7.873054",
    lng: "80.771797",
  },
  {
    n: "Sudan",
    i: "sd",
    c: ["249"],
    lat: "12.862807",
    lng: "30.217636",
  },
  {
    n: "Suriname",
    i: "sr",
    c: ["597"],
    lat: "3.919305",
    lng: "-56.027783",
  },
  {
    n: "Svalbard And Jan Mayen",
    i: "sj",
    c: ["47"],
    lat: "77.553604",
    lng: "23.670272",
  },
  {
    n: "Swaziland",
    i: "sz",
    c: ["268"],
    lat: "-26.522503",
    lng: "31.465866",
  },
  {
    n: "Sweden",
    i: "se",
    c: ["46"],
    lat: "60.128161",
    lng: "18.643501",
  },
  {
    n: "Switzerland",
    i: "ch",
    c: ["41"],
    lat: "46.818188",
    lng: "8.227512",
  },
  {
    n: "Syria",
    i: "sy",
    c: ["963"],
    lat: "34.802075",
    lng: "38.996815",
  },
  {
    n: "São Tomé and Príncipe",
    i: "st",
    c: ["239"],
    lat: "0.18636",
    lng: "6.613081",
  },
  {
    n: "Taiwan",
    i: "tw",
    c: ["886"],
    lat: "23.69781",
    lng: "120.960515",
  },
  {
    n: "Tajikistan",
    i: "tj",
    c: ["992"],
    lat: "38.861034",
    lng: "71.276093",
  },
  {
    n: "Tanzania",
    i: "tz",
    c: ["255"],
    lat: "-6.369028",
    lng: "34.888822",
  },
  {
    n: "Thailand",
    i: "th",
    c: ["66"],
    lat: "15.870032",
    lng: "100.992541",
  },
  {
    n: "Togo",
    i: "tg",
    c: ["228"],
    lat: "8.619543",
    lng: "0.824782",
  },
  {
    n: "Tokelau",
    i: "tk",
    c: ["690"],
    lat: "-8.967363",
    lng: "-171.855881",
  },
  {
    n: "Tonga",
    i: "to",
    c: ["676"],
    lat: "-21.178986",
    lng: "-175.198242",
  },
  {
    n: "Trinidad and Tobago",
    i: "tt",
    c: ["1868"],
    lat: "10.691803",
    lng: "-61.222503",
  },
  {
    n: "Tristan de Cunha",
    i: "ta",
    c: ["290"],
    lat: "37.1052",
    lng: "12.2777",
  },
  {
    n: "Tunisia",
    i: "tn",
    c: ["216"],
    lat: "33.886917",
    lng: "9.537499",
  },
  {
    n: "Turkey",
    i: "tr",
    c: ["90"],
    lat: "38.963745",
    lng: "35.243322",
  },
  {
    n: "Turkmenistan",
    i: "tm",
    c: ["993"],
    lat: "38.969719",
    lng: "59.556278",
  },
  {
    n: "Turks and Caicos Islands",
    i: "tc",
    c: ["1649"],
    lat: "21.694025",
    lng: "-71.797928",
  },
  {
    n: "Tuvalu",
    i: "tv",
    c: ["688"],
    lat: "-7.109535",
    lng: "177.64933",
  },
  {
    n: "Uganda",
    i: "ug",
    c: ["256"],
    lat: "1.373333",
    lng: "32.290275",
  },
  {
    n: "Ukraine",
    i: "ua",
    c: ["380"],
    lat: "48.379433",
    lng: "31.16558",
  },
  {
    n: "United Arab Emirates",
    i: "ae",
    c: ["971"],
    lat: "23.424076",
    lng: "53.847818",
  },
  {
    n: "United Kingdom",
    i: "gb",
    c: ["44"],
    lat: "55.378051",
    lng: "-3.435973",
  },
  {
    n: "United States",
    i: "us",
    c: ["1"],
    lat: "37.09024",
    lng: "-95.712891",
  },
  {
    n: "Uruguay",
    i: "uy",
    c: ["598"],
    lat: "-32.522779",
    lng: "-55.765835",
  },
  {
    n: "Uzbekistan",
    i: "uz",
    c: ["998"],
    lat: "41.377491",
    lng: "64.585262",
  },
  {
    n: "Vanuatu",
    i: "vu",
    c: ["678"],
    lat: "-15.376706",
    lng: "166.959158",
  },
  {
    n: "Vatican City State",
    i: "va",
    c: ["379"],
    lat: "41.902916",
    lng: "12.453389",
  },
  {
    n: "Venezuela",
    i: "ve",
    c: ["58"],
    lat: "6.42375",
    lng: "-66.58973",
  },
  {
    n: "Vietnam",
    i: "vn",
    c: ["84"],
    lat: "14.058324",
    lng: "108.277199",
  },
  {
    n: "Wallis and Futuna",
    i: "wf",
    c: ["681"],
    lat: "-13.768752",
    lng: "-177.156097",
  },
  {
    n: "Yemen",
    i: "ye",
    c: ["967"],
    lat: "15.552727",
    lng: "48.516388",
  },
  {
    n: "Zambia",
    i: "zm",
    c: ["260"],
    lat: "-13.133897",
    lng: "27.849332",
  },
  {
    n: "Zimbabwe",
    i: "zw",
    c: ["263"],
    lat: "-19.015438",
    lng: "29.154857",
  },
  {
    n: "Burma-Myanmar",
    i: "mm",
    c: ["95"],
    lat: "16.871311",
    lng: "96.199379",
  },
  {
    n: "Curaçao",
    i: "cw",
    c: ["599"],
    lat: "12.169570",
    lng: "-68.990021",
  },
  {
    n: "Timor-Leste",
    i: "tl",
    c: ["670"],
    lat: "-8.556856",
    lng: "125.560310",
  },
  {
    n: "Falkland Islands",
    i: "fk",
    c: ["500"],
    lat: "-51.563412",
    lng: "-59.820557",
  },
  {
    n: "Ivory Coast",
    i: "ci",
    c: ["225"],
    lat: "5.345317",
    lng: "-4.024429",
  },
  {
    n: "Macedonia",
    i: "mk",
    c: ["389"],
    lat: "41.599683",
    lng: "21.697476",
  },
  {
    n: "Palestine",
    i: "ps",
    c: ["970"],
    lat: "31.898043",
    lng: "35.204269",
  },
  {
    n: "Saint Martin",
    i: "mf",
    c: ["1599"],
    lat: "50.827545",
    lng: "3.268148",
  },
  {
    n: "South Sudan",
    i: "ss",
    c: ["211"],
    lat: "4.859363",
    lng: "31.571251",
  },
  {
    n: "Virgin Islands",
    i: "vi",
    c: ["1340"],
    lat: "18.319410",
    lng: "-64.703247",
  },
  {
    n: "Western Sahara",
    i: "eh",
    c: ["212"],
    lat: "24.215527",
    lng: "-12.885834",
  },
];