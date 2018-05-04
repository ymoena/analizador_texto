function cargarLexicon() {
  return (lexicon = document.getElementById("lexicon").contentDocument.body.firstChild.innerHTML.split(/\n/));
}
function cargarStopWords() {
  return (stopwords = document.getElementById("stopwords").contentDocument.body.firstChild.innerHTML.split(/\n/));
}

function iniciarAnalisis() {
  var frase = document.getElementById("frase").value.replace(/\s+/g, " ");

  console.log(frase);

  if (frase.length == 0) {
    console.log("Cadena esta vacia");
  } else {
    //console.log("Cadena contiene ",frase.length," palabras");
    readfile(frase);
  }
}
function Limpiar() {
  document.getElementById("frase").value = "";
  document.getElementById("plexicon").innerHTML = "";
  document.getElementById("tabla2").innerHTML = "";
  document.getElementById("tabla3").innerHTML = "";
  document.getElementById("tabla4").innerHTML = "";
  document.getElementById("tabla5").innerHTML = "";
  document.getElementById("tabla6").innerHTML = "";
}
function readfile(frase) {
  var lexicon = cargarLexicon();
  var stopwords = cargarStopWords();

  document.getElementById("plexicon").innerHTML = "";
  document.getElementById("tabla2").innerHTML = "";
  document.getElementById("tabla3").innerHTML = "";
  document.getElementById("tabla4").innerHTML = "";
  document.getElementById("tabla5").innerHTML = "";
  document.getElementById("tabla6").innerHTML = "";

  ProcesarTextoEntrada(frase, lexicon, stopwords);

}

function searchStringInArray(str, strArray) {
  for (var j = 0; j < strArray.length; j++) {
    var temp_str = strArray[j].split(" ");
    if (temp_str[0].indexOf(str) == 0 && temp_str[0].length == str.length) {
      return j;
      break;
    }
  }
  return -1;
}

function ProcesarTextoEntrada(cadena, lexicon, stopwords) {
  var VectorLexicon = [];
  var VectorNoExiste = [];
  var VectorStopWords = [];
  //
  var VectorPositivo = [];
  var VectorNegativo = [];
  var VectorNeutro = [];
  //
  var sumatoria = [];
  var cadena = cadena.trim().split(/, | |,|!|¡|[¿?]|[.]/);
  console.log(
    "Tamaño cadena: ",
    cadena.length,
    " Lexicon: ",
    lexicon.length,
    " StopWords: ",
    stopwords.length
  );
  console.log("Cadena dividida:", cadena);

  for (var j = 0; j < cadena.length; j++) {
    cadena[j] = cadena[j].toLowerCase();
    var temporal_L = searchStringInArray(cadena[j], lexicon);
    var temporal_S = searchStringInArray(cadena[j], stopwords);
    //console.log("temporal_L and temporal_S: ",temporal_L,temporal_S);
    //console.log("temporal es: ",temporal,j)

    if (temporal_S != -1) {
      sumatoria.push(0);
      VectorStopWords.push(cadena[j]);
      //console.log("La palabra ", cadena[j], " esta en el stopWords");
    } else {
      if (temporal_L != -1) {
        VectorLexicon.push(cadena[j]);
        //console.log("La palabra ", cadena[j], " esta en el lexicon");

        //Obtener si es positiva o negativa
        var tempPalabra = lexicon[temporal_L].split(" ");
        var tipoPalabra = tempPalabra[1]; //Negativo o Positivo
        console.log(tempPalabra[1], tempPalabra);

        if (tipoPalabra === "negativo") {
          //La palabra es negativa
          console.log(tipoPalabra);
          VectorNegativo.push(cadena[j]);
          sumatoria.push(-1);
        } else if (tipoPalabra === "positivo") {
          //La palabra es positiva
          console.log(tipoPalabra);
          VectorPositivo.push(cadena[j]);
          sumatoria.push(1);
        } else if (tipoPalabra === "neutro") {
          //La palabra es positiva
          console.log(tipoPalabra);
          sumatoria.push(0);
          VectorNeutro.push(cadena[j]);
        }
      } else {
        sumatoria.push(0);
        // console.log("La palabra ",cadena[j],"NO esta en el stopWords ni en el lexicon");
        VectorNoExiste.push(cadena[j]);
      }
    }
  }

  var sum = sumatoria.reduce(function(a, b) {
    return a + b;
  }, 0);
  console.log("La sumatoria es: ", sumatoria, " = ", sum);
  console.log("Palabras en StopWords: ", VectorStopWords);
  console.log("Palabras en Lexicon: ", VectorLexicon);
  console.log("Palabras Positivas: ", VectorPositivo);
  console.log("Palabras Negativas: ", VectorNegativo);
  console.log("Palabras Neutrales: ", VectorNeutro);
  console.log("Palabras en NoExiste: ", VectorNoExiste);

  ImprimirResultad(
    cadena,
    lexicon,
    stopwords,
    sumatoria,
    VectorStopWords,
    VectorPositivo,
    VectorNegativo,
    VectorNeutro,
    VectorNoExiste
  );
  MostrarPositivas(VectorPositivo);
  MostrarNegativas(VectorNegativo);
  MostrarNeutras(VectorNeutro);
  MostrarSW(VectorNoExiste, VectorStopWords);
}
function ImprimirResultad(
  cadena,
  lexicon,
  stopwords,
  sumatoria,
  VectorStopWords,
  VectorPositivo,
  VectorNegativo,
  VectorNeutro,
  VectorNoExiste
) {
  var sum = sumatoria.reduce(function(a, b) {
    return a + b;
  }, 0);

  var cant0s = 0,
    cant1s = 0,
    cantmenos1 = 0;

  for (i = 0; i < sumatoria.length; i++) {
    if (sumatoria[i] == 0) {
      cant0s++;
    } else if (sumatoria[i] == 1) {
      cant1s++;
    } else if (sumatoria[i] == -1) {
      cantmenos1++;
    }
  }
  console.log(cant0s, cant1s, cantmenos1);

  var resultadofinal;
  console.log("El total es: ", sum);
  if (sum == 0) {
    resultadofinal =
      "<h1 class='final blanco text-center'>La frase es Neutra <span class='glyphicon glyphicon-hand-left'></span></h1>";
  } else if (sum > 0) {
    resultadofinal =
      "<h1 class='final verde text-center'>La frase es Positiva <span class='glyphicon glyphicon-thumbs-up'></span></h1>";
  } else if (sum < 0) {
    resultadofinal =
      "<h1 class='final rojo text-center'>La frase es Negativa <span class='glyphicon glyphicon-thumbs-down'></span></h1>";
  }

  console.log(lexicon.length);
  var plexicon = document.getElementById("plexicon");
  plexicon.innerHTML =
    "<p id='resultados1'>Total Palabras en Lexicon: <span class='label lb-lg label-primary'>" +
    lexicon.length +
    "</span></p><p id='resultados1'>Total Palabras en StopWords: <span class='label  lb-lg label-primary'>" +
    stopwords.length +
    "</span></p><p id='resultados1'>  Cantidad de palabras a analizar: <span class='label  lb-lg label-primary'>" +
    cadena.length +
    "</span></p><br>" +
    "<p id='resultados1'># Palabras Positivas: <span class='label lb-lg  label-success'>" +
    VectorPositivo.length +
    "</p><p id='resultados1'># Palabras Negativas: <span class='label  lb-lg label-danger'>" +
    VectorNegativo.length +
    "</p><p id='resultados1'># Palabras Neutras: <span class='label  lb-lg label-default'>" +
    VectorNeutro.length +
    "</p><br>" +
    "<p id='resultados1'># Palabras en StopWords: <span class='label lb-lg  label-info'>" +
    VectorStopWords.length +
    "</p><p id='resultados1'># Palabras que No Existen: <span class='label  lb-lg label-info'>" +
    VectorNoExiste.length +
    "</p><br>" +
    "<h4 class='resultados2' >Sumatoria: " +
    cant0s +
    "*(0)+" +
    cant1s +
    "*(1)+" +
    cantmenos1 +
    "*(-1)= " +
    sum +
    "</h2><br>" +
    resultadofinal +
    "";

  return;
}

function MostrarTabla() {
  var lexicon = cargarLexicon();
  var stopwords = cargarStopWords();

  var table = document.getElementById("tablaL");
  var tableS = document.getElementById("tablaS");

  for (var j = 0; j < lexicon.length; j++) {
    var temp_str = lexicon[j].split(" ");

    var row = table.insertRow(table.lenght);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = temp_str[0];
    cell2.innerHTML = temp_str[1];
  }

  for (var j = 0; j < stopwords.length; j++) {
    var row = tableS.insertRow(tableS.lenght);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);

    cell1.innerHTML = stopwords[j];
    j++;
    cell2.innerHTML = stopwords[j];
    j++;
    cell3.innerHTML = stopwords[j];
    j++;
    cell4.innerHTML = stopwords[j];
  }
}

function BuscarLexicon() {
  // Declare variables
  var input, filter, table, tr, td, i;
  input = document.getElementById("entradaL");
  filter = input.value.toUpperCase();
  table = document.getElementById("tablaL");
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function MostrarPositivas(VectorPositivo) {
  var tableS = document.getElementById("tabla2");

  var cont = 0;

  for (var j = 0; j < VectorPositivo.length; j++) {
    var row = tableS.insertRow(tableS.lenght);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);

    if (VectorPositivo[j] != null) {
      cell1.innerHTML = VectorPositivo[j];
      j++;
    }

    if (VectorPositivo[j] != null) {
      cell2.innerHTML = VectorPositivo[j];
      j++;
    }
    if (VectorPositivo[j] != null) {
      cell3.innerHTML = VectorPositivo[j];
      j++;
    }
    if (VectorPositivo[j] != null) {
      cell4.innerHTML = VectorPositivo[j];
    }
  }
}

function MostrarNegativas(VectorNegativo) {
  var tableS = document.getElementById("tabla3");

  for (var j = 0; j < VectorNegativo.length; j++) {
    var row = tableS.insertRow(tableS.lenght);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);

    if (VectorNegativo[j] != null) {
      cell1.innerHTML = VectorNegativo[j];
      j++;
    }

    if (VectorNegativo[j] != null) {
      cell2.innerHTML = VectorNegativo[j];
      j++;
    }
    if (VectorNegativo[j] != null) {
      cell3.innerHTML = VectorNegativo[j];
      j++;
    }
    if (VectorNegativo[j] != null) {
      cell4.innerHTML = VectorNegativo[j];
    }
  }
}

function MostrarNeutras(VectorNeutro) {
  var tableS = document.getElementById("tabla4");

  for (var j = 0; j < VectorNeutro.length; j++) {
    var row = tableS.insertRow(tableS.lenght);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);

    if (VectorNeutro[j] != null) {
      cell1.innerHTML = VectorNeutro[j];
      j++;
    }

    if (VectorNeutro[j] != null) {
      cell2.innerHTML = VectorNeutro[j];
      j++;
    }
    if (VectorNeutro[j] != null) {
      cell3.innerHTML = VectorNeutro[j];
      j++;
    }
    if (VectorNeutro[j] != null) {
      cell4.innerHTML = VectorNeutro[j];
    }
  }
}

function MostrarSW(VectorNoExiste, VectorStopWords) {
  var tableS = document.getElementById("tabla6");
  var tableSw = document.getElementById("tabla5");

  for (var j = 0; j < VectorStopWords.length; j++) {
    var row = tableSw.insertRow(tableSw.lenght);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);

    if (VectorStopWords[j] != null) {
      cell1.innerHTML = VectorStopWords[j];
      j++;
    }

    if (VectorStopWords[j] != null) {
      cell2.innerHTML = VectorStopWords[j];
      j++;
    }
    if (VectorStopWords[j] != null) {
      cell3.innerHTML = VectorStopWords[j];
      j++;
    }
    if (VectorStopWords[j] != null) {
      cell4.innerHTML = VectorStopWords[j];
    }
  }

  for (var j = 0; j < VectorNoExiste.length; j++) {
    var row = tableS.insertRow(tableS.lenght);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);

    if (VectorNoExiste[j] != null) {
      cell1.innerHTML = VectorNoExiste[j];
      j++;
    }

    if (VectorNoExiste[j] != null) {
      cell2.innerHTML = VectorNoExiste[j];
      j++;
    }
    if (VectorNoExiste[j] != null) {
      cell3.innerHTML = VectorNoExiste[j];
      j++;
    }
    if (VectorNoExiste[j] != null) {
      cell4.innerHTML = VectorNoExiste[j];
    }
  }
}

function BuscarStopWords() {
  
  var input, filter, table, tr, td, i;
  input = document.getElementById("entradaS");
  filter = input.value.toUpperCase();
  table = document.getElementById("tablaS");
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
