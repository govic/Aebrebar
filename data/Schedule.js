var task = [
    {
        "id": "1",
        "name": "Preconstruction",
        "start": "2020-12-23",
        "end": "2020-12-27",
        "progress": "0",
        "dependencies": "",
        "custom_class": "bar-milestone"
    },
    {
        "id": "110",
        "name": "Level 1: Floor Slab / Foundation Edges",
        "start": "2020-12-30",
        "end": "2021-01-03",
        "progress": "0",
        "dependencies": "1",
        "custom_class": "bar-milestone"
    },
    {
        "id": "111",
        "name": "Level 1: Floor Slab / Foundations",
        "start": "2021-01-04",
        "end": "2021-01-12",
        "progress": "0",
        "dependencies": "110",
        "custom_class": "bar-milestone"
    },
    {
        "id": "120",
        "name": "Level 1: Columns",
        "start": "2021-01-13",
        "end": "2021-01-17",
        "progress": "0",
        "dependencies": "111",
        "custom_class": "bar-milestone"
    },
    {
        "id": "130",
        "name": "Level 1: Beams",
        "start": "2021-01-20",
        "end": "2021-01-29",
        "progress": "0",
        "dependencies": "120",
        "custom_class": "bar-milestone"
    },
    {
        "id": "140",
        "name": "Level 1: Joists",
        "start": "2021-01-30",
        "end": "2021-02-12",
        "progress": "0",
        "dependencies": "130",
        "custom_class": "bar-milestone"
    },
    {
        "id": "150",
        "name": "Level 1: Exterior Walls-Core",
        "start": "2021-01-31",
        "end": "2021-02-05",
        "progress": "0",
        "dependencies": "140",
        "custom_class": "bar-milestone"
    },
    {
        "id": "151",
        "name": "Level 1: Exterior Walls-EIFS",
        "start": "2021-02-06",
        "end": "2021-02-10",
        "progress": "0",
        "dependencies": "150",
        "custom_class": "bar-milestone"
    },
    {
        "id": "152",
        "name": "Level 1: Exterior Walls-Interior Finish",
        "start": "2021-04-04",
        "end": "2021-04-08",
        "progress": "0",
        "dependencies": "151",
        "custom_class": "bar-milestone"
    },
    {
        "id": "210",
        "name": "Level 2: Floor Deck",
        "start": "2021-02-13",
        "end": "2021-02-19",
        "progress": "0",
        "dependencies": "140",
        "custom_class": "bar-milestone"
    },
    {
        "id": "220",
        "name": "Level 2: Columns",
        "start": "2021-02-20",
        "end": "2021-02-26",
        "progress": "0",
        "dependencies": "210",
        "custom_class": "bar-milestone"
    },
    {
        "id": "230",
        "name": "Level 2: Beams",
        "start": "2021-02-27",
        "end": "2021-03-10",
        "progress": "0",
        "dependencies": "220",
        "custom_class": "bar-milestone"
    },
    {
        "id": "240",
        "name": "Level 2: Joists",
        "start": "2021-03-11",
        "end": "2021-03-24",
        "progress": "0",
        "dependencies": "230",
        "custom_class": "bar-milestone"
    },
    {
        "id": "250",
        "name": "Level 2: Exterior Walls",
        "start": "2021-03-25",
        "end": "2021-04-07",
        "progress": "0",
        "dependencies": "240",
        "custom_class": "bar-milestone"
    },
    {
        "id": "310",
        "name": "Level 3: Floor Deck",
        "start": "2021-03-25",
        "end": "2021-03-31",
        "progress": "0",
        "dependencies": "240",
        "custom_class": "bar-milestone"
    },
    {
        "id": "320",
        "name": "Level 3: Columns",
        "start": "2021-04-01",
        "end": "2021-04-07",
        "progress": "0",
        "dependencies": "310",
        "custom_class": "bar-milestone"
    },
    {
        "id": "330",
        "name": "Level 3: Beams",
        "start": "2021-04-08",
        "end": "2021-04-17",
        "progress": "0",
        "dependencies": "320",
        "custom_class": "bar-milestone"
    },
    {
        "id": "340",
        "name": "Level 3: Joists",
        "start": "2021-04-18",
        "end": "2021-05-01",
        "progress": "0",
        "dependencies": "330",
        "custom_class": "bar-milestone"
    },
    {
        "id": "350",
        "name": "Level 3: Exterior Walls",
        "start": "2021-05-02",
        "end": "2021-05-15",
        "progress": "0",
        "dependencies": "340",
        "custom_class": "bar-milestone"
    },
    {
        "id": "410",
        "name": "Level 4: Roof",
        "start": "2021-05-02",
        "end": "2021-05-08",
        "progress": "0",
        "dependencies": "340",
        "custom_class": "bar-milestone"
    },
    {
        "id": "510",
        "name": "All: Stairs",
        "start": "2021-04-18",
        "end": "2021-05-01",
        "progress": "0",
        "dependencies": "330",
        "custom_class": "bar-milestone"
    },
    {
        "id": "610",
        "name": "All: Windows & Doors",
        "start": "2021-05-16",
        "end": "2021-05-29",
        "progress": "0",
        "dependencies": "350",
        "custom_class": "bar-milestone"
    },
    {
        "id": "710",
        "name": "All: Curtain Walls",
        "start": "2021-05-16",
        "end": "2021-05-30",
        "progress": "0",
        "dependencies": "350",
        "custom_class": "bar-milestone"
    },
    {
        "id": "810",
        "name": "All: Railings",
        "start": "2021-05-02",
        "end": "2021-05-09",
        "progress": "0",
        "dependencies": "510",
        "custom_class": "bar-milestone"
    },
    {
        "id": "910",
        "name": "All: Interior Walls",
        "start": "2021-05-10",
        "end": "2021-05-20",
        "progress": "0",
        "dependencies": "610",
        "custom_class": "bar-milestone"
    }
];