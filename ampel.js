// Corona Ampel Peru Widget
//
// Copyright (C) 2020 by map <mail@map.wtf>
//
// Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER
// IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE
// OF THIS SOFTWARE.

let widget = new ListWidget();
let padding = 22;
widget.setPadding(padding, padding, padding, padding);
widget.url = "https://covid19.minsa.gob.pe/sala_situacional.asp";

let apiResponse = await loadItems();

let header = widget.addText("🚦Covid-19 Perú".toUpperCase());
header.font = Font.mediumSystemFont(10);

widget.addSpacer(16);

let vStack = widget.addStack();
vStack.layoutHorizontally();

addDataView(vStack, apiResponse.indicators.basic_reproduction_number);
vStack.addSpacer();
addDataView(vStack, apiResponse.indicators.incidence_new_infections);
widget.addSpacer();

addDataView(widget, apiResponse.indicators.icu_occupancy_rate);

Script.setWidget(widget);
Script.complete();
widget.presentSmall();

function addDataView(widget, data) {
  let viewStack = widget.addStack();
  viewStack.layoutVertically();

  let label = viewStack.addText(data.shortDescription);
  label.font = Font.mediumSystemFont(12);

  if (data.footnote != "") {
    let footnote = viewStack.addText(data.footnote);
    footnote.font = Font.mediumSystemFont(6);
  }

  let value = viewStack.addText(data.stringValue);
  value.font = Font.mediumSystemFont(20);
  value.textColor = colorForString(data.color);
}

async function loadItems() {
  let url =
    "https://raw.githubusercontent.com/Derakz/corona/main/peru_corona_traffic_light.latest.json";
  let req = new Request(url);
  let json = await req.loadJSON();
  json.indicators.basic_reproduction_number.shortDescription = "Casos";
  json.indicators.incidence_new_infections.shortDescription = "Fallecidos";
  json.indicators.icu_occupancy_rate.shortDescription = "Letalidad";
  json.indicators.basic_reproduction_number.footnote = "Totales";
  json.indicators.incidence_new_infections.footnote = "Totales";
  json.indicators.icu_occupancy_rate.footnote = "";
  json.indicators.basic_reproduction_number.stringValue = json.indicators.basic_reproduction_number.value.toString();
  json.indicators.incidence_new_infections.stringValue = json.indicators.incidence_new_infections.value.toString();
  json.indicators.icu_occupancy_rate.stringValue =
    json.indicators.icu_occupancy_rate.value.toString() + "%";
  return json;
}

function colorForString(colorString) {
  if (colorString == "red") {
    return Color.red();
  }
  if (colorString == "yellow") {
    return Color.yellow();
  }
  return Color.green();
}



