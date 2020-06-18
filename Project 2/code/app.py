from flask import Flask, render_template, request, redirect, Response, jsonify
import pandas as pd
import numpy as np
import random
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.manifold import MDS
from sklearn.metrics import pairwise_distances
import scipy.spatial.distance
import matplotlib.pyplot as plt
import json
import warnings
warnings.filterwarnings("ignore")

app = Flask(__name__)

df = pd.read_csv('NY_student_clean.csv')
features = ["Ageyears","Height_cm","Travel_time_to_School","Score_in_memory_game","Sleep_Hours_Schoolnight","Home_Occupants","Doing_Homework_Hours","Outdoor_Activities_Hours","Video_Games_Hours","Social_Websites_Hours","Computer_Use_Hours","Watching_TV_Hours"]
df = df[features]

@app.route('/')
def index():
	return render_template('index.html',data={})

def random_sampling(data):
    random_data = data.sample(frac=0.25, random_state = 1)
    return random_data

def stratified_sampling(data):
	data_arr = np.array(data)
	sse_array = []
	for i in range(2, 15):
		km = KMeans(n_clusters=i)
		km.fit(data_arr)
		sse_array.append(km.inertia_)

	fig = plt.figure()
	ax = fig.add_subplot(111)
	ax.plot(range(2, 15), sse_array, marker='o', markeredgecolor='r', color='b')
	# Mark the Elbow Point
	ax.plot(5, sse_array[3], marker='o', markersize=12, markeredgewidth=2, markeredgecolor='r',markerfacecolor='None')
	plt.grid(True)
	plt.xlabel('Number of clusters')
	plt.ylabel('Sum of Squared Errors (SSE)')
	plt.title('Elbow plot for K-Means clustering')
	plt.xticks(range(2, 15, 2))
	plt.draw()

	km = KMeans(n_clusters=5)
	km.fit(data_arr)
	data['Label'] = km.labels_
	cluster_sizes = np.bincount(km.labels_)
	stratified_sampling_results = pd.DataFrame(columns=data.columns)
	for i in range(5):
		cluster_size = cluster_sizes[i]
		cluster_records = data[data['Label'] == i]
		sample_size = int(cluster_size * 0.25)
		stratified_sampling_results = pd.concat([stratified_sampling_results, cluster_records.iloc[random.sample(range(cluster_size), sample_size)]])
	return stratified_sampling_results

def calculate_PCA(data):
	pca = PCA()
	pca.fit(data)
	pca_results = pca.explained_variance_ratio_
	loadings = np.sum(np.square(pca.components_), axis=0)
	indices_of_top_3_attributes = loadings.argsort()[-3:][::-1]
	top_two_components = pca.components_[:2]
	return pca_results, indices_of_top_3_attributes, top_two_components

def calculate_MDS_Euclidean(data):
	mds_data = MDS(n_components=2, dissimilarity='precomputed')
	similarity = pairwise_distances(data, metric='euclidean')
	X = mds_data.fit_transform(similarity)
	return X
def calculate_MDS_Correlation(data):
	mds_data = MDS(n_components=2, dissimilarity='precomputed')
	similarity = pairwise_distances(data, metric='correlation')
	X = mds_data.fit_transform(similarity)
	return X	

def pca_Scatter(data):
	pca = PCA(n_components=2)
	X = data
	principalComponents = pca.fit_transform(X)
	return principalComponents  


@app.route('/noSamplingScree')
def noSamplingScree():
	results, top_3_attributes, top_two_components = calculate_PCA(df[features])
	print("\n\nTop 3 Attributes:\n")
	print(df.columns[top_3_attributes].tolist(),"\n\n")
	data_frontend = dict()
	data_frontend["cumSum"] = np.cumsum(results).tolist()
	data_frontend["eigen"] = results.tolist()
	return data_frontend

@app.route('/randomSamplingScree')
def randomSamplingScree():
	results, top_3_attributes, top_two_components = calculate_PCA(random_sampling_results)
	print("\n\nTop 3 Attributes:\n")
	print(df.columns[top_3_attributes].tolist(),"\n\n")
	data_frontend = dict()
	data_frontend["cumSum"] = np.cumsum(results).tolist()
	data_frontend["eigen"] = results.tolist()
	return data_frontend

@app.route('/stratifiedSamplingScree')
def stratifiedSamplingScree():
	results, top_3_attributes, top_two_components = calculate_PCA(stratified_sampling_results)
	print("\n\nTop 3 Attributes:\n")
	print(df.columns[top_3_attributes].tolist(),"\n\n")
	data_frontend = dict()
	data_frontend["cumSum"] = np.cumsum(results).tolist()
	data_frontend["eigen"] = results.tolist()
	return data_frontend

@app.route('/originalScatterPlot')
def originalScatterPlot():
	return {"scatterData": pca_Scatter(df[features]).tolist()}
@app.route('/randomSamplingScatterPlot')
def randomSamplingScatterPlot():
	return {"scatterData": pca_Scatter(random_sampling_results).tolist()}
@app.route('/stratifiedSamplingScatterPlot')
def stratifiedSamplingScatterPlot():
	return {"scatterData":pca_Scatter(stratified_sampling_results).tolist()}


@app.route('/originalMDSEuclidean')
def originalMDSEuclidean():
	return {"scatterData": calculate_MDS_Euclidean(df[features]).tolist()}
@app.route('/randomSamplingMDSEuclidean')
def randomSamplingMDSEuclidean():
	return {"scatterData": calculate_MDS_Euclidean(random_sampling_results).tolist()}
@app.route('/stratifiedSamplingMDSEuclidean')
def stratifiedSamplingMDSEuclidean():
	return {"scatterData": calculate_MDS_Euclidean(stratified_sampling_results).tolist()}


@app.route('/originalMDSCorrelation')
def originalDSCorrelation():
	return {"scatterData": calculate_MDS_Correlation(df[features]).tolist()}
@app.route('/randomSamplingMDSCorrelation')
def randomSamplingMDSCorrelation():
	return {"scatterData": calculate_MDS_Correlation(random_sampling_results).tolist()}
@app.route('/stratifiedSamplingMDSCorrelation')
def stratifiedSamplingMDSCorrelation():
	return {"scatterData": calculate_MDS_Correlation(stratified_sampling_results).tolist()}


@app.route('/originalMatrix')
def originalMatrix():
	global df
	results, top_3_attributes, top_two_components = calculate_PCA(df[features])
	return {"scatterData":np.array(df[df.columns[top_3_attributes]]).tolist(),"names":df.columns[top_3_attributes].tolist()}
@app.route('/randomSamplingMatrix')
def randomSamplingMatrix():
	global df
	results, top_3_attributes, top_two_components = calculate_PCA(random_sampling_results)
	return {"scatterData":np.array(random_sampling_results[df.columns[top_3_attributes]]).tolist(),"names":df.columns[top_3_attributes].tolist()}
@app.route('/stratifiedSamplingMatrix')
def stratifiedSamplingMatrix():
	global df
	results, top_3_attributes, top_two_components = calculate_PCA(stratified_sampling_results)
	return {"scatterData":np.array(stratified_sampling_results[df.columns[top_3_attributes]]).tolist(),"names":df.columns[top_3_attributes].tolist()}

random_sampling_results = random_sampling(df)
stratified_sampling_results = stratified_sampling(df)

if __name__ == '__main__':
	app.run(debug=True)
