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
(default,'Special District', 'N/A' )
ON CONFLICT (name) DO NOTHING;

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
(default, 'PARKING_AREAS', 'PARKING AREAS')
ON CONFLICT (name) DO NOTHING;

INSERT INTO met_station (
    station_id, name, state, geom, affiliations, tidal, greatlakes
) VALUES
('8720030', 'Fernandina Beach', 'FL', ST_SetSRID(ST_MakePoint(-81.46584, 30.671356), 4326), 'NWLORTS', TRUE, FALSE),
('8720215', 'Navy Fuel Depot', 'FL', ST_SetSRID(ST_MakePoint(-81.6267, 30.4), 4326), 'PORTS', TRUE, FALSE),
('8720218', 'Mayport (Bar Pilots Dock)', 'FL', ST_SetSRID(ST_MakePoint(-81.42789, 30.398167), 4326), 'NWLORTS', TRUE, FALSE),
('8720219', 'Dames Point', 'FL', ST_SetSRID(ST_MakePoint(-81.5583, 30.3867), 4326), 'PORTS', TRUE, FALSE),
('8720228', 'Little Jetties Visibility', 'FL', ST_SetSRID(ST_MakePoint(-81.44603, 30.37936), 4326), 'PORTS', TRUE, FALSE),
('8720233', 'Blount Island Command', 'FL', ST_SetSRID(ST_MakePoint(-81.52253, 30.392584), 4326), 'PORTS', TRUE, FALSE),
('8720245', 'Jacksonville University', 'FL', ST_SetSRID(ST_MakePoint(-81.61175, 30.354084), 4326), 'PORTS', TRUE, FALSE),
('8720357', 'I-295 Buckman Bridge', 'FL', ST_SetSRID(ST_MakePoint(-81.68889, 30.192417), 4326), 'PORTS', TRUE, FALSE),
('8721604', 'Trident Pier, Port Canaveral', 'FL', ST_SetSRID(ST_MakePoint(-80.5931, 28.4158), 4326), 'NWLON', TRUE, FALSE),
('8722670', 'Lake Worth Pier, Atlantic Ocean', 'FL', ST_SetSRID(ST_MakePoint(-80.034164, 26.612778), 4326), 'NWLON', TRUE, FALSE),
('8722956', 'South Port Everglades', 'FL', ST_SetSRID(ST_MakePoint(-80.11667, 26.081667), 4326), 'PORTS', TRUE, FALSE),
('8723214', 'Virginia Key', 'FL', ST_SetSRID(ST_MakePoint(-80.1618, 25.7314), 4326), 'NWLORTS', TRUE, FALSE),
('8723970', 'Vaca Key, Florida Bay', 'FL', ST_SetSRID(ST_MakePoint(-81.1065, 24.711), 4326), 'NWLON', TRUE, FALSE),
('8724580', 'Key West', 'FL', ST_SetSRID(ST_MakePoint(-81.8079, 24.5557), 4326), 'NWLON', TRUE, FALSE),
('8725520', 'Fort Myers', 'FL', ST_SetSRID(ST_MakePoint(-81.87111, 26.647778), 4326), 'NWLON', TRUE, FALSE),
('8726384', 'Port Manatee', 'FL', ST_SetSRID(ST_MakePoint(-82.5621, 27.6387), 4326), 'PORTS', TRUE, FALSE),
('8726412', 'Middle Tampa Bay', 'FL', ST_SetSRID(ST_MakePoint(-82.599525, 27.66175), 4326), 'PORTS', TRUE, FALSE),
('8726504', 'Cut D Channel, Inbound Rear Range', 'FL', ST_SetSRID(ST_MakePoint(-82.513695, 27.753584), 4326), '', TRUE, FALSE),
('8726520', 'St. Petersburg', 'FL', ST_SetSRID(ST_MakePoint(-82.6269, 27.7606), 4326), 'NWLORTS', TRUE, FALSE),
('8726607', 'Old Port Tampa', 'FL', ST_SetSRID(ST_MakePoint(-82.5528, 27.8578), 4326), 'PORTS', TRUE, FALSE),
('8726671', 'Sparkman Channel Entrance', 'FL', ST_SetSRID(ST_MakePoint(-82.4452, 27.920528), 4326), '', TRUE, FALSE),
('8726674', 'East Bay', 'FL', ST_SetSRID(ST_MakePoint(-82.4214, 27.9231), 4326), 'PORTS', TRUE, FALSE),
('8726679', 'East Bay Causeway', 'FL', ST_SetSRID(ST_MakePoint(-82.42575, 27.928888), 4326), 'PORTS', TRUE, FALSE),
('8726694', 'TPA Cruise Terminal 2', 'FL', ST_SetSRID(ST_MakePoint(-82.44586, 27.942972), 4326), 'PORTS', TRUE, FALSE),
('8726724', 'Clearwater Beach', 'FL', ST_SetSRID(ST_MakePoint(-82.831665, 27.978333), 4326), 'NWLON', TRUE, FALSE),
('8727520', 'Cedar Key', 'FL', ST_SetSRID(ST_MakePoint(-83.0317, 29.135), 4326), 'NWLON', TRUE, FALSE),
('8728690', 'Apalachicola', 'FL', ST_SetSRID(ST_MakePoint(-84.98055, 29.724445), 4326), 'NWLON', TRUE, FALSE),
('8729108', 'Panama City', 'FL', ST_SetSRID(ST_MakePoint(-85.664444, 30.149723), 4326), 'NWLON', TRUE, FALSE),
('8729210', 'Panama City Beach', 'FL', ST_SetSRID(ST_MakePoint(-85.878586, 30.21375), 4326), 'NWLON', TRUE, FALSE),
('8729840', 'Pensacola', 'FL', ST_SetSRID(ST_MakePoint(-87.2112, 30.4044), 4326), 'NWLON', TRUE, FALSE)
ON CONFLICT (station_id) DO UPDATE SET
    name = EXCLUDED.name,
    state = EXCLUDED.state,
    geom = EXCLUDED.geom,
    affiliations = EXCLUDED.affiliations,
    tidal = EXCLUDED.tidal,
    greatlakes = EXCLUDED.greatlakes;
