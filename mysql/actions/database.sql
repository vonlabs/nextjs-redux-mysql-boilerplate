CREATE TABLE login_providers(
    ProviderID int NOT NULL AUTO_INCREMENT UNIQUE,
    ProviderName varchar(150) NOT NULL UNIQUE,
    PRIMARY KEY (ProviderID)
);

INSERT INTO login_providers(ProviderName) VALUES ('native');

CREATE TABLE users (
    UserID int NOT NULL AUTO_INCREMENT UNIQUE,
    Email varchar(150) NOT NULL,
    Username varchar(150),
    Name varchar(256),
    ProviderID int NOT NULL,
    EmailApproval BOOLEAN,
    Activated BOOLEAN,
    created_at varchar(32),
    PRIMARY KEY (UserID),
    FOREIGN KEY (ProviderID) REFERENCES login_providers(ProviderID)
);
ALTER TABLE `users` ADD UNIQUE `unique_index`(`Email`, `ProviderID`);





CREATE TABLE apt_accounts
  (
    id                   INT NOT NULL AUTO_INCREMENT,
    compound_id          VARCHAR(255) NOT NULL,
    user_id              INTEGER NOT NULL,
    provider_type        VARCHAR(255) NOT NULL,
    provider_id          VARCHAR(255) NOT NULL,
    provider_account_id  VARCHAR(255) NOT NULL,
    refresh_token        TEXT,
    access_token         TEXT,
    access_token_expires TIMESTAMP(6),
    created_at           TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at           TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id)
  );

CREATE TABLE apt_sessions
  (
    id            INT NOT NULL AUTO_INCREMENT,
    user_id       INTEGER NOT NULL,
    expires       TIMESTAMP(6) NOT NULL,
    session_token VARCHAR(255) NOT NULL,
    access_token  VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at    TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id)
  );

CREATE TABLE apt_users
  (
    id             INT NOT NULL AUTO_INCREMENT,
    name           VARCHAR(255),
    email          VARCHAR(255),
    email_verified TIMESTAMP(6),
    image          VARCHAR(255),
    created_at     TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at     TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id)
  );

CREATE TABLE apt_verification_requests
  (
    id         INT NOT NULL AUTO_INCREMENT,
    identifier VARCHAR(255) NOT NULL,
    token      VARCHAR(255) NOT NULL,
    expires    TIMESTAMP(6) NOT NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id)
  );

CREATE UNIQUE INDEX compound_id
  ON apt_accounts(compound_id);

CREATE INDEX provider_account_id
  ON apt_accounts(provider_account_id);

CREATE INDEX provider_id
  ON apt_accounts(provider_id);

CREATE INDEX user_id
  ON apt_accounts(user_id);

CREATE UNIQUE INDEX session_token
  ON apt_sessions(session_token);

CREATE UNIQUE INDEX access_token
  ON apt_sessions(access_token);

CREATE UNIQUE INDEX email
  ON apt_users(email);

CREATE UNIQUE INDEX token
  ON apt_verification_requests(token);