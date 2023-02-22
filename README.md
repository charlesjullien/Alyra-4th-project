Alyra's 4th project ! A good old NFT Marketplace ! :D

watch demo here : https://www.youtube.com/watch?v=5foo15Ur9yw

Testé sur Goerli pendant la demo car problemes étranges avec hardhat... je ne sais pas si cela vient de mon code ou mon PC...

Vercel est très lent et me mettait des erreurs liées au contenu (pourtant classique) de mon package.json frontend... j'ai trouvé l'erreur, mais voilà que la plateforme prend beaucoup de temps à process ma demande de mise en ligne et après 46 minutes me dit "Deployment failed with error."... :/ Je laisse les serveurs refroidir et je re essaie. 

les contrats ont déjà été déployés dans ce repo (c'est ceux de la video demo). Les abis et addresses sont présentes dans le front dans /src/artifacts/.

launch project :

insert .env file in backend with mtching keys from hardhat.config.js


cd backend

yarn install

bash script.sh

cd ../frontend

yarn install

yarn start
