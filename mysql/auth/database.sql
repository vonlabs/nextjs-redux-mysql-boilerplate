CREATE TABLE passport (
    ID int NOT NULL AUTO_INCREMENT UNIQUE,
    UserID int UNIQUE,
    password             varchar(256) NOT NULL,
    expiration           varchar(32) NOT NULL,
    created_at           varchar(32) NOT NULL,
    updated_at           varchar(32) NOT NULL,
    PRIMARY KEY (ID)
);

CREATE TABLE activation (
    ID int NOT NULL AUTO_INCREMENT UNIQUE,
    UserID int UNIQUE,
    linkToActivate       varchar(256) NOT NULL UNIQUE,
    expiration           varchar(25) NOT NULL,
    created_at           varchar(32) NOT NULL,
    updated_at           varchar(32) NOT NULL,
    PRIMARY KEY (ID)
);

CREATE TABLE resetpassword (
    ID int NOT NULL AUTO_INCREMENT UNIQUE,
    UserID int UNIQUE,
    linkToResetPassword  varchar(256) NOT NULL,
    expiration           varchar(25)  NOT NULL,
    created_at           varchar(32) NOT NULL,
    updated_at           varchar(32) NOT NULL,
    PRIMARY KEY (ID)
);

CREATE TABLE logintry (
    ID int NOT NULL AUTO_INCREMENT UNIQUE,
    UserID int,
    created_at           varchar(32) NOT NULL,
    PRIMARY KEY (ID)
);