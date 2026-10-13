-- ========================================
-- STARWAVE - SAMPLE DATABASE DATA
-- ========================================


-- SAMPLE AGENCIES

INSERT INTO agencies
(name, description, website)
VALUES
(
    'StarWave Entertainment',
    'A fictional entertainment agency for StarWave audition testing.',
    'https://example.com'
),
(
    'NextWave Entertainment',
    'A fictional entertainment agency for audition testing.',
    'https://example.com'
),
(
    'RisingStar Entertainment',
    'A fictional entertainment agency for audition testing.',
    'https://example.com'
),
(
    'DreamStage Entertainment',
    'A fictional entertainment agency for audition testing.',
    'https://example.com'
)
ON CONFLICT DO NOTHING;


-- SAMPLE CATEGORIES

INSERT INTO categories
(name, description)
VALUES
(
    'Vocal',
    'Singing and vocal performance auditions.'
),
(
    'Dance',
    'Dance and performance auditions.'
),
(
    'Rap',
    'Rap and hip-hop performance auditions.'
)
ON CONFLICT DO NOTHING;