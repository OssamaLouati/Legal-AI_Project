cd ..
git clone https://github.com/TheAtticusProject/cuad.git
mv cuad cuad-training
unzip cuad-training/data.zip -d cuad-data/
mkdir cuad-models
curl https://zenodo.org/record/4599830/files/roberta-base.zip?download=1 --output cuad-models/roberta-base.zip
unzip cuad-models/roberta-base.zip -d cuad-models/
