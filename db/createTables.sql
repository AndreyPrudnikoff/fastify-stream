
create table if not exists Users(
	Id UUID PRIMARY KEY,
	Login VARCHAR(99) NOT NULL,
	Email VARCHAR(99) NOT NULL unique,
	Password VARCHAR(99) NOT NULL,
	Avatar VARCHAR(256),
	Role VARCHAR(99) NOT NULL
	);

create table if not exists Videos(
	Id UUID PRIMARY KEY,
	Name VARCHAR(99) NOT NULL,
	Link VARCHAR(256) NOT NULL,
	Owner UUID NOT NULL,
	Duration VARCHAR(99) NOT NULL,
	Quality VARCHAR(99) NOT NULL,
	Created timestamp NOT NULL,
	FOREIGN KEY (Owner) REFERENCES Users(Id)
);

