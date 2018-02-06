"use strict";

var xmlParser = require('xml2js').parseString;
var fileSystem = require('fs');
var ics = require('ics');
var moment = require('moment');
var uuid = require('uuid');

// var url = 'https://webapi.login.vu.nl/api/study/Events/51505135/EN/29-01-2018/01-04-2018';

var xml = fileSystem.readFile('./advanced-logic.xml', {encoding: 'utf8'}, function (error, xml) {
    xmlParser(xml, function (error, schedule) {
        ics.createCalendar(
            schedule.ArrayOfEvent.Event.map(function (event) {
                return {
                    title: event.Title[0] + ' (' + event.Type[0] + ')',
                    start: parseDate(event.Start[0]),
                    duration: {
                        minutes: getDuration(event.Start[0], event.End[0])
                    },
                    location: event.Locations[0].Location[0].Code[0],
                    uid: uuid.v4()
                };
            }), {}, function (error, calendar) {
                fileSystem.writeFile('calendar.ics', calendar)
            }
        );
    });
});

function parseDate(date) {

    let dateMoment = date2moment(date);

    return [
        dateMoment.year(),
        dateMoment.month(),
        dateMoment.date(),
        dateMoment.hour(),
        dateMoment.minute()
    ]
}

function getDuration(startDate, endDate) {

    let start = date2moment(startDate);
    let end = date2moment(endDate);

    return end.diff(start, 'minutes')
}

function date2moment (date) {
    return moment(date)
}