--#1
INSERT INTO account VALUES
	(DEFAULT, 'Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n', DEFAULT);
--#2
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

--#3
DELETE FROM public.account
WHERE account_firstname = 'Tony';

--#4
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_model = 'Hummer';

--#5
SELECT inv_make, inv_model, classification_name
FROM classification cl
	JOIN inventory inv
		ON cl.classification_id = inv.classification_id
WHERE classification_name = 'Sport';

--#6
Update public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');