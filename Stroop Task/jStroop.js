class Stroop {

  constructor(maxCount, testType) {

    this.validKeys = ['r', 'g', 'b', 'y'];

    this.colors = [
      '#f20a1d', // red
      '#07e31d', // green
      '#243cf2', // blue
      '#e6d705', // yellow
    ];

    this.colorKey = [
      'red', 'green', 'blue', 'yellow'
    ],

    this.smokingWords = [
      'tobacco',
      'drag',
      'cigarette',
      'smoke',
      'ashtray',
      'puff',
      'lighter',
      'inhale',
      'smoking',
      'nicotine',

      'charm',
      'dear',
      'devotion',
      'excited',
      'joke',
      'peace',
      'playful',
      'pleasant',
      'sweet',
      'thrilled',

      'annoy',
      'awful',
      'boredom',
      'complain',
      'cruel',
      'gloomy',
      'tearful',
      'sadness',
      'sinful',
      'slum',

      'fan',
      'fence',
      'folder',
      'notebook',
      'pile',
      'portion',
      'reported',
      'sewing',
      'shift',
      'stand'
    ];

    this.practiceWords = [
      'RED',
      'BLUE',
      'GREEN',
      'YELLOW',
    ]

    this.autoAdvance;

    this.count = 0;
    this.maxCount = maxCount;

    if(testType == 'practice'){
      this.words = this.practiceWords;
    }

    else {
      this.words = this.smokingWords;
    }

    this.currentWord;
    this.currentColor;

    this.acceptInput;
    this.displayTime;

    this.responses = [];
  }

  start() {
    self = this;
    console.log("Stroop is starting");
    setTimeout(function() {
      self.next();
    }, 5000);
  }

  next() {
    clearTimeout(this.autoAdvance);
    this.acceptInput = true;
    if(this.count == this.maxCount) this.end();
    self = this;
    this.currentWord = this.newWord();
    this.currentColor = this.newColor();
    this.displayWord();
    // If no key is pressed
    this.autoAdvance = setTimeout(function() {
      self.newResponse(0, false);
      self.displayIncorrect();
      setTimeout(function() {
        self.next();
      }, 1000);// response show (X)
    }, 2500);// Stimuli time (Color words)
  }

  getResponse(e) {
    let correct;
    self = this;
    if(this.validKeys.includes(e.key) && this.acceptInput) {
      clearTimeout(this.autoAdvance);
      if(this.validKeys.indexOf(e.key) == this.currentColor){
        correct = true;
        this.newResponse(e.key, correct);
        this.next();
      }
      else {
        correct = false;
        this.displayIncorrect();
        this.acceptInput = false;
        setTimeout(function() {
          self.next();
        }, 1000);
        this.newResponse(e.key, correct);
      }
    }
  }

  newResponse(key, correct) {
    console.log(key)
    let r = {
      word: this.words[this.currentWord],
      color: this.colorKey[this.currentColor],
      time: new Date().getTime() - this.displayTime,
      keyPressed: key,
      correct: correct
    }

    this.responses.push(r);
    
  }         

  newWord() {
    let newWord = Math.floor(Math.random() * Math.floor(this.words.length));
    while(this.currentWord == newWord) {
      newWord = Math.floor(Math.random() * Math.floor(this.words.length));
    }
    return newWord;
  }

  newColor() {
    let newColor = Math.floor(Math.random() * Math.floor(this.colors.length));
    while(this.currentColor == newColor) {
      newColor = Math.floor(Math.random() * Math.floor(this.colors.length));
    }
    return newColor;
  }

  displayIncorrect() {
    let word = jQuery('.word');
    word.text('X').css({'color':self.colors[0]});
  }

  displayWord() {
    this.count++;
    this.displayTime = new Date().getTime();
    let self = this;
    let word = jQuery('.word');
    word.text('+').css({'color': '#000'});
    setTimeout(function() {
      console.log("Displaying " + self.words[self.currentWord]);
      word.text(self.words[self.currentWord]).css({'color':self.colors[self.currentColor]});
    }, 500);
  }

  end() {

    //let results = JSON.stringify(this.responses, '\t', 2);
    //jQuery( document ).trigger( "jStroopEnd", [ results ] );
    //console.log(results);
    // function download(content, fileName, contentType) {
    // var a = document.createElement("a");
    // var file = new Blob([content], {type: contentType});
    // a.href = URL.createObjectURL(file);
    // a.download = fileName;
    // a.click();
    function convertToCSV(objArray) {
      var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
      var str = '';
  
      for (var i = 0; i < array.length; i++) {
          var line = '';
          for (var index in array[i]) {
              if (line != '') line += ','
  
              line += array[i][index];
          }
  
          str += line + '\r\n';
      }
  
      return str;
    }
  
  
    function exportCSVFile(results, fileTitle) {
    console.log(results);
    var itemsFormatted = [];
  
    // format the data
    results.forEach((item) => {
        itemsFormatted.push({
            word: item.word.replace(/,/g, ''), // remove commas to avoid errors,
            color: item.color,
            time: item.time,
            keypressed: item.keyPressed,
            correct: item.correct 
    });
  }
  );
    var headers = {
         word: 'Word'.replace(/,/g, ''), // remove commas to avoid errors
         color: "Color",
         time: "Time",
         keypressed: "key",
         correct: "Correct"
      };    
  
      if (headers) {
          itemsFormatted.unshift(headers);
      }
  
      // Convert Object to JSON
      var jsonObject = JSON.stringify(itemsFormatted);
  
      var csv = convertToCSV(jsonObject);
  
      var exportedFilenmae = fileTitle + '.csv' || 'export.csv';
  

      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      if (navigator.msSaveBlob) { // IE 10+
          navigator.msSaveBlob(blob, exportedFilenmae);
      } else {
          var link = document.createElement("a");
          if (link.download !== undefined) { // feature detection
              // Browsers that support HTML5 download attribute
              var url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute("download", exportedFilenmae);
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
          }
      }
    }
    exportCSVFile(this.responses, 'fileTitle')

  }
  // download(results, 'json.txt', 'text/plain');
  
  }

