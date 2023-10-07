import React, { useState, useEffect } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, setFilteredPosts } from "../../../reducers";
import "../../../App.css";

const BlogPost = () => {
	const dispatch = useDispatch();
	const allPosts = useSelector((state) => state.posts);
	const [loading, setLoading] = useState(true);
	const [posts, setPostsState] = useState(allPosts);

	useEffect(() => {
		// Effettua una richiesta GET all'endpoint del tuo server backend
		fetch("http://localhost:5050/blogposts")
			.then((response) => response.json())
			.then((data) => {
				// I dati ottenuti dalla richiesta vengono inviati a Redux usando l'azione setPosts
				dispatch(setPosts(data));
				// Imposta i post locali con i dati ottenuti
				setPostsState(data);

				// Ritarda l'impostazione di loading a false per 5 secondi
				setTimeout(() => {
					setLoading(false);
				}, 3000);
			})
			.catch((error) => {
				console.error("Errore durante il recupero dei post:", error);
				// Imposta loading a false in caso di errore nel caricamento dei dati
				setLoading(false);
			});
	}, [dispatch]); // Assicurati di passare dispatch come dipendenza per evitare warning sull'uso di dispatch nel useEffect

	const handleSearch = (e) => {
		const query = e.target.value.toLowerCase();
		const filteredPosts = allPosts.filter((post) => {
			const titleMatch = post.title.toLowerCase().includes(query);
			const authorMatch = post.author.name.toLowerCase().includes(query);
			const categoryMatch = post.category.toLowerCase().includes(query);

			// Restituisci true se il titolo, l'autore o la categoria corrispondono alla query
			return titleMatch || authorMatch || categoryMatch;
		});

		// I dati filtrati vengono inviati a Redux usando l'azione setFilteredPosts
		dispatch(setFilteredPosts(filteredPosts));
		// Aggiorna lo stato locale per visualizzare i risultati filtrati
		setPostsState(filteredPosts);
	};
	if (loading) {
		// Se i dati stanno ancora caricando, mostra un messaggio di caricamento
		return (
			<div className="text-center bg-info fs-1 fw-bold">
				<Spinner className="me-2" animation="border" variant="light" />
				Caricamento in corso...
			</div>
		);
	}

	return (
		<div className="container-fluid bg-dark">
			<div className="navbar-home bg-danger">
				<input
					className="input-search"
					type="text"
					placeholder="Cerca per titolo, autore o categoria..."
					onChange={handleSearch}
				/>
			</div>
			<Row xs={1} md={3} className="g-4">
				{posts.map((post) => (
					<Col key={post._id}>
						<div className="blog-post-container">
							<h2 className="blog-post-title">{post.title}</h2>
							<p className="blog-post-category">Categoria: {post.category}</p>
							<p className="blog-post-author">Autore: {post.author.name}</p>
							<p className="blog-post-readtime">
								Tempo di Lettura: {post.readtime.value} {post.readtime.unit}
							</p>
							<img
								className="blog-post-image"
								src={post.cover}
								alt="Copertina del Blog Post"
							/>
							<p className="blog-post-content">{post.content}</p>
						</div>
					</Col>
				))}
			</Row>
		</div>
	);
};

export default BlogPost;
