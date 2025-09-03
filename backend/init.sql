-- CREATE TABLE locations_app_locationcategory (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(100) UNIQUE NOT NULL,
--     description TEXT
-- );

INSERT INTO locations_app_locationcategory Values
(default,'Municipal', 'N/A' ),
(default,'County', 'N/A'),
(default,'Commercial', 'N/A' ),
(default,'State', 'N/A' ),
(default,'Club', 'N/A'),
(default,'Non-Profit', 'N/A' ),
(default,'Federal', 'N/A'),
(default,'Special District', 'N/A' );

-- CREATE TABLE locations_app_recreationtype  (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(100) UNIQUE NOT NULL,
--     description TEXT
-- );

INSERT INTO locations_app_recreationtype Values
(default, 'S_USE_CANOE_KAYAK_TRAIL',  'SINGLE USE CANOE/KAYAK TRAIL'),
(default, 'FRESHWATER_BEACH_LENGTH', 'FRESHWATER BEACH LENGTH'),
(default, 'FRESHWATER_BEACHES', 'FRESHWATER BEACHES'),
(default, 'SALTWATER_BEACHES', 'SALTWATER BEACHES'),
(default, 'FRESHWATER_CATWALKS', 'FRESHWATER CATWALKS'),
(default, 'SALTWATER_CATWALKS', 'SALTWATER CATWALKS'),
(default, 'FRESHWATER_PIERS', 'FRESHWATER PIERS'),
(default, 'SALTWATER_PIERS', 'SALTWATER PIERS'),
(default, 'FRESHWATER_BOAT_RAMPS', 'FRESHWATER BOAT RAMPS'),
(default, 'SALTWATER_BOAT_RAMPS', 'SALTWATER BOAT RAMPS'),
(default, 'SW_CANOE_KAYAK_LAUNCHES', 'SALT WATER CANOE KAYAK LAUNCHES'),
(default, 'FW_CANOE_KAYAK_LAUNCHES', 'FRESH WATER CANOE KAYAK LAUNCHES'),
(default, 'PARKING_AREAS', 'PARKING AREAS');

