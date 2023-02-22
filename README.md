Alyra's 4th project ! A good old NFT Marketplace ! :D

watch demo here : https://www.youtube.com/watch?v=5foo15Ur9yw
(j'ai mis la video de demo en vitesse x2... elle faisait 18 minutes).

Testé sur Goerli pendant la demo car problemes étranges avec hardhat... je ne sais pas si cela vient de mon code ou mon PC...

https://alyra-4th-project.vercel.app/

les contrats ont déjà été déployés dans ce repo (c'est ceux de la video demo). Les abis et addresses sont présentes dans le front dans /src/artifacts/.

launch project :

insert .env file in backend with mtching keys from hardhat.config.js


cd backend

yarn install

bash script.sh

cd ../frontend

yarn install

yarn start
