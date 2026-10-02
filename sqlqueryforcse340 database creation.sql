-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');


CREATE TABLE service_project (
    service_project_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date_begin DATE,
	organization_id INT,
	FOREIGN KEY (organization_id) REFERENCES organization(organization_id)
);

INSERT INTO service_project (title, description, location, date_begin)
VALUES
('Not Known Yet', 're through sustainable construction projects.', 'Nigeria', '2/12/2026', 3)

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE
);

INSERT INTO category (name)
VALUES ('Educational'), ('Health and Wellness'), ('Environmental'), ('Community Service') ;

CREATE TABLE service_project_category (
    service_project_id INT NOT NULL,
    category_id INT NOT NULL,

    PRIMARY KEY (service_project_id, category_id),

    FOREIGN KEY (service_project_id)
        REFERENCES service_project(service_project_id),

    FOREIGN KEY (category_id)
        REFERENCES category(category_id)
);

INSERT INTO service_project_category
    (service_project_id, category_id)
VALUES
    (1, 1),
    (1, 3),
    (2, 2),
	(3, 4),
	(1, 4);