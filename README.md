# DPC PDF Layout

## Table of contents
* [1. Introduction](#introduction)
* [2. Deployment](#setup)
* [3. Deployment](#deployment)
* [4. Application](#application)
* [5. ToDo](#todo)

## 1. Introduction <a name="introduction"></a>

DPC PDF Layout is a node application to prepare data for further PDF generation.

#### 2. Cluster setup <a name="setup"></a>

Set local path as `/kubernetes`. Then execute commands:
```console
kubectl apply -f pdfgenerator-pv.yaml
kubectl apply -f pdfgenerator-media-deployment.yaml
```
After all run deployment as pointed in 3.

## 3. Deployment <a name="deployment"></a>

#### 3.1 Versioning

For publishing the image with new tag one should push to git a label with major version.

#### 3.2 Building

#### 3.2.1 Running the build

To buld the image and place it to registry one should run the build
[QA.DPC.PdfLayout.V2](https://tfs.dev.qsupport.ru/tfs/QuantumartCollection/QA.DPC/_build/index?definitionId=1117&_a=completed)

The minor version part added automatically.

#### 3.2.2 Checking the registry

After build finishes the image `dpc-pdfgenerator/pdflayout-api` must be in registry images list:
[Docker registry](http://spbdocker03:5000/v2/_catalog).
Also avaliable image tags can be seen here:
[Image tags](http://spbdocker03:5000/v2/dpc-pdfgenerator/pdflayout-api/tags/list).

#### 3.3 Running the release

Release [QA.DPC.PdfLayout.Kubernetes](https://tfs.dev.qsupport.ru/tfs/QuantumartCollection/QA.DPC/_release?definitionId=8&_a=releases) runs automatically after build. It deploys the application to kubernetes cluster.

## 4. Application <a name="application"></a>

### 4.1 Endpoints

Application provides two endpoints:
* [API](http://pdflayout-api.dpc-pdfgenerator.dev.qsupport.ru/)
* [Media](http://media.dpc-pdfgenerator.dev.qsupport.ru/) 

API is used to process queries to generate the data. As a result API returns relative path to data beeing generated.
Media is used to acess generated data. One should pass relative path to Media to download the generated content.
All generated content is stored on persistent volume and availible via share `\\storage\msckubepv\dpc-pdflayout`


### 4.2 Useful commands

View application logs
```console
kubectl logs --tail=50 -l app=pdflayout-api -n dpc-pdfgenerator
```

Open sh session for container
```console
POD=$(kubectl get pod -l app=pdflayout-api -n dpc-pdfgenerator -o jsonpath="{.items[0].metadata.name}")
kubectl exec -it $POD -n dpc-pdfgenerator sh
```

## 5. ToDo <a name="todo"></a>

* Get rid of logging to file via env flags
* Use sructured logging
* Setup logging for elasticsearch
* Create dashboard for logging
* Create dashboard for metrics



