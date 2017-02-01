CREATE DATABASE fifa17;
    -- WITH
    -- OWNER = postgres
    -- ENCODING = 'UTF8'
    -- TABLESPACE = pg_default
    -- CONNECTION LIMIT = -1;

CREATE TABLE public.users
(
    id SERIAL NOT NULL,
    name text,
    score integer
);

CREATE TABLE public.games
(
    id SERIAL NOT NULL,
    winner_id integer,
    loser_id integer,
    winner_score integer,
    loser_score integer,
    winner_goals integer,
    loser_goals integer,
    date integer
);
