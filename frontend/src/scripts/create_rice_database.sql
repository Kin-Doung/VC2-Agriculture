-- Create rice types database
CREATE TABLE IF NOT EXISTS rice_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    scientific_name VARCHAR(100),
    description TEXT,
    origin VARCHAR(100),
    grain_length VARCHAR(20),
    color VARCHAR(50),
    cooking_time INTEGER, -- in minutes
    characteristics JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample rice types
INSERT INTO rice_types (name, scientific_name, description, origin, grain_length, color, cooking_time, characteristics) VALUES
('Basmati Rice', 'Oryza sativa', 'Long-grain aromatic rice with a distinctive nutty flavor and fluffy texture when cooked.', 'India/Pakistan', 'long', 'white', 18, '["Long slender grains", "Aromatic fragrance", "Light and fluffy", "Nutty flavor"]'),

('Jasmine Rice', 'Oryza sativa', 'Fragrant long-grain rice with a subtle floral aroma and slightly sticky texture.', 'Thailand', 'long', 'white', 15, '["Floral aroma", "Slightly sticky", "Sweet flavor", "Medium-long grains"]'),

('Arborio Rice', 'Oryza sativa', 'Short-grain rice with high starch content, perfect for creamy risottos.', 'Italy', 'short', 'white', 20, '["High starch content", "Creamy texture", "Short plump grains", "Ideal for risotto"]'),

('Brown Rice', 'Oryza sativa', 'Whole grain rice with the bran layer intact, providing more nutrients and fiber.', 'Various', 'medium', 'brown', 45, '["Whole grain", "Nutty flavor", "Chewy texture", "High in fiber"]'),

('Wild Rice', 'Zizania', 'Actually a grass seed, not true rice. Dark colored with a nutty, earthy flavor.', 'North America', 'long', 'dark brown', 50, '["Not true rice", "Nutty earthy flavor", "Dark color", "Chewy texture"]'),

('Sushi Rice', 'Oryza sativa japonica', 'Short-grain rice that becomes sticky when cooked, perfect for sushi.', 'Japan', 'short', 'white', 20, '["Short round grains", "Sticky when cooked", "Slightly sweet", "Perfect for sushi"]'),

('Black Rice', 'Oryza sativa', 'Antioxidant-rich rice with a deep purple-black color and nutty flavor.', 'China', 'medium', 'black', 35, '["High in antioxidants", "Purple-black color", "Nutty flavor", "Chewy texture"]'),

('Red Rice', 'Oryza sativa', 'Whole grain rice with a reddish bran layer and earthy, nutty flavor.', 'Various', 'medium', 'red', 40, '["Reddish bran layer", "Earthy flavor", "Whole grain", "Chewy texture"]');
