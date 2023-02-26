Alyra's 4th project ! 

Projet déployé sur le testnet Ethereum Goerli.
Ne fonctionne qu'avec des GOERLI ETH de test (sur son metamask par exemple)

Projet que j'ai réalisé entièrement en une semaine pour mon jury final de ma formation de développeur blockchain chez Alyra.

J'ai surtout mis l'accent sur le backend qui est finalement la partie la plus importante du projet. 

Pour lancer les tests unitaires dans /backend/. : 

yarn hardhat test.

J'ai réalisé une NFT Factory avec la fonction create2 en assembly dans mon contrat NftCollectionFactory.sol

cette fonction génère une adresse de nouvelle collection à attacher au constructeur ERC721 (appelé dans NftCollection.sol pour créer une nouvelle collection.) 

Le fonctionnement (grosso modo) de la marketplace : 
- On peut créer une collection avec un nom et symbol.
- Le proprietaire (seulement) de cette collection peut minter des NFTs de cette collection.
- Il peut choisir de lister ces NFTs à la vente en y associant un prix.
- Dé-lister les NFts qu'il a mit en vente, et changer le prix par la suite.
- Acheter les NFTs d'autres utilisateurs.

Il me reste pas mal de features à implémenter pour améliorer le projet... système de bidding, royalties, payment splitter, plus d'infos de métadonnées... 
Mon frontend est assez... basique disons et j'ai conscience que l'UI / UX est très limitée. Mais bon... en 7 jours, j'ai fait de mon mieux.

<img width="412" alt="Stack TECH MarketplaceNFT" src="https://user-images.githubusercontent.com/61630987/221421391-27d3aece-070f-418b-bfb3-13afb3f69bdc.PNG">

Les fichiers liés aux NFTs sont uploadés sur IPFS via pinata dans un JSON comprenant les métadonnées du NFT. (L'URI de création du token ERC721 de la collection associée).


watch demo here : https://www.youtube.com/watch?v=5foo15Ur9yw
(j'ai mis la video de demo en vitesse x2... elle faisait 18 minutes).

déployé sur :

https://alyra-4th-project.vercel.app/

les contrats ont déjà été déployés dans ce repo (c'est ceux de la video demo). Les abis et addresses sont présentes dans le front dans /src/artifacts/.

launch project :

insert .env file in backend with matching keys from hardhat.config.js


cd backend

yarn install

bash script.sh

cd ../frontend

yarn install

yarn start
