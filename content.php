<?php
/**
 * @package oompthree
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<header class="entry-header">
		<?php the_title( sprintf( '<h1 class="entry-title"><a href="%s" rel="bookmark">', esc_url( get_permalink() ) ), '</a></h1>' ); ?>

		<?php if ( 'post' == get_post_type() ) : ?>
		<div class="entry-meta">
			<?php oompthree_posted_on(); ?>
		</div><!-- .entry-meta -->
		<?php endif; ?>
	</header><!-- .entry-header -->
		<?php
			/* do the featured gallery 
					cycle on mouseover 
			*/
			echo '<div id="featured-gallery-' . $post->ID .'" class="featured-gallery">';
			echo '<a href="' . get_permalink( $post->ID ) .'">';
			$galleryArray = get_post_gallery_ids($post->ID); 
			$num = 0;
			foreach ($galleryArray as $id) { 
					//this should only be rendered for the index
    				if($num == 0) {
    						echo '<img id="featured-img-'. $id .'" class="active-img featured-img" src=' . wp_get_attachment_url( $id ) .'>';
    				} else {
    						echo '<img id="featured-img-'. $id .'" class="featured-img" src=' . wp_get_attachment_url( $id ) .'>';
    				}
    				$num++;

			}

			
		?>
	</a>
	</div>
	<div class="entry-content">
		<?php
			/* translators: %s: Name of current post */
			the_content( sprintf(
				__( 'View project %s <span class="meta-nav">&rarr;</span>', oompthree ), 
				the_title( '<span class="screen-reader-text">"', '"</span>', false )
			) );
		?>

		<?php
			wp_link_pages( array(
				'before' => '<div class="page-links">' . __( 'Pages:', oompthree ),
				'after'  => '</div>',
			) );
		?>
	</div><!-- .entry-content -->

	<footer class="entry-footer">
		<?php oompthree_entry_footer(); ?>
	</footer><!-- .entry-footer -->
</article><!-- #post-## -->
