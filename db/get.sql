//<<<<<<< INSERT VIDEOS >>>>>>>>>

INSERT INTO videos(Id, Name, Link, Owner, Duration, Quality, Created) VALUES($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP(0));


//<<<<<<< GET VIDEOS >>>>>>>>>

select v.name, v.link, v.duration, v.quality, v.created, u.login as owner
from videos v
left join users u on v.owner=u.id;
