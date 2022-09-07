CREATE TABLE USERS (
    user_id SERIAL UNIQUE PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(12)
);

INSERT INTO USERS (first_name, last_name, email, phone) VALUES ('Sasha', 'Nik', '1234@gmail.com', '0501234567');

CREATE TABLE STREAMING_SERVICE (
    streamingService_id SERIAL UNIQUE PRIMARY KEY,
    streaming_name VARCHAR(255) NOT NULL
);

INSERT INTO STREAMING_SERVICE (streaming_name) VALUES ('YouTube');
INSERT INTO STREAMING_SERVICE (streaming_name) VALUES ('Megogo');

CREATE TABLE SUBSCRIPTION (
    subscription_id SERIAL UNIQUE PRIMARY KEY,
    user_id INTEGER REFERENCES USERS (user_id),
    streamingService_id INTEGER REFERENCES STREAMING_SERVICE (streamingService_id)
);

INSERT INTO SUBSCRIPTION (user_id, streamingService_id) VALUES (1, 1);
INSERT INTO SUBSCRIPTION (user_id, streamingService_id) VALUES (1, 2)



CREATE TYPE genre AS ENUM ('comedy', 'horror', 'sitcom', 'reality');

CREATE TABLE SHOWS (
    show_id SERIAL UNIQUE PRIMARY KEY,
    show_name VARCHAR(255) NOT NULL,
    genre genre,
    release_date DATE,
    viewsByShowName INTEGER,
    streamingService_id INTEGER REFERENCES STREAMING_SERVICE (streamingService_id)
);


INSERT INTO SHOWS (show_name, genre, release_date, streamingService_id) VALUES ('Friends', 'sitcom', '1994/02/25', 0, 2);
INSERT INTO SHOWS (show_name, genre, release_date, streamingService_id) VALUES ('Suits', 'comedy', '2004/09/18', 1);


CREATE TABLE SERIES (
    series_id SERIAL UNIQUE PRIMARY KEY,
    series_name VARCHAR(255) NOT NULL
);

INSERT INTO SERIES (series_name) VALUES ('Friends, 1st Season');


CREATE TABLE EPISODE (
    episode_id SERIAL UNIQUE PRIMARY KEY,
    episode_name VARCHAR(255) NOT NULL,
    episode_duration INTEGER,
    show_id INTEGER REFERENCES SHOWS (show_id),
    series_id INTEGER REFERENCES SERIES (series_id)
);

INSERT INTO EPISODE (episode_name, episode_duration, show_id, series_id) VALUES ('The One Where Monica Gets a Roommate (Pilot Episode)', 22, 1, 1);
INSERT INTO EPISODE (episode_name, episode_duration, show_id, series_id) VALUES ('The One With The Sonogram At The End', 22, 1, 1);