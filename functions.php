<?php
/**
 * oompthree functions and definitions
 *
 * @package oompthree
 */

/**
 * Set the content width based on the theme's design and stylesheet.
 */
if ( ! isset( $content_width ) ) {
	$content_width = 640; /* pixels */
}

if ( ! function_exists( 'oompthree_setup' ) ) :
/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function oompthree_setup() {

	/*
	 * Make theme available for translation.
	 * Translations can be filed in the /languages/ directory.
	 * If you're building a theme based on oompthree, use a find and replace
	 * to change oompthree to the name of your theme in all the template files
	 */
	load_theme_textdomain( oompthree, get_template_directory() . '/languages' );

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	/*
	 * Enable support for Post Thumbnails on posts and pages.
	 *
	 * @link http://codex.wordpress.org/Function_Reference/add_theme_support#Post_Thumbnails
	 */
	//add_theme_support( 'post-thumbnails' );

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus( array(
		'primary' => __( 'Primary Menu', oompthree ),
	) );

	/*
	 * Switch default core markup for search form, comment form, and comments
	 * to output valid HTML5.
	 */
	add_theme_support( 'html5', array(
		'search-form', 'comment-form', 'comment-list', 'gallery', 'caption',
	) );

	/*
	 * Enable support for Post Formats.
	 * See http://codex.wordpress.org/Post_Formats
	 */
	add_theme_support( 'post-formats', array(
		'aside', 'image', 'video', 'quote', 'link',
	) );

	// Set up the WordPress core custom background feature.
	add_theme_support( 'custom-background', apply_filters( 'oompthree_custom_background_args', array(
		'default-color' => 'ffffff',
		'default-image' => '',
	) ) );
}
endif; // oompthree_setup
add_action( 'after_setup_theme', 'oompthree_setup' );

/**
 * Register widget area.
 *
 * @link http://codex.wordpress.org/Function_Reference/register_sidebar
 */
function oompthree_widgets_init() {
	register_sidebar( array(
		'name'          => __( 'Sidebar', oompthree ),
		'id'            => 'sidebar-1',
		'description'   => '',
		'before_widget' => '<aside id="%1$s" class="widget %2$s">',
		'after_widget'  => '</aside>',
		'before_title'  => '<h1 class="widget-title">',
		'after_title'   => '</h1>',
	) );
}
add_action( 'widgets_init', 'oompthree_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function oompthree_scripts() {
	wp_enqueue_style( 'oompthree-style', get_stylesheet_uri() );

	//wp_enqueue_script( 'oompthree-navigation', get_template_directory_uri() . '/js/navigation.js', array(), '20120206', true );
	wp_register_script('jQuery', 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js');
	wp_enqueue_script('jQuery');
	wp_register_script('jQueryMigrate', 'https://code.jquery.com/jquery-migrate-3.0.0.js');
	wp_enqueue_script('jQueryMigrate');
	


	wp_enqueue_script( 'oompthree-skip-link-focus-fix', get_template_directory_uri() . '/js/skip-link-focus-fix.js', array(), '20130115', true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}

}
add_action( 'wp_enqueue_scripts', 'oompthree_scripts' );
/**
 *	OOMPthree custom scripts
 */
function oompthree_custom_scripts() {
	//registering three.min.js script for webgl 3d
	wp_register_script('three-js', get_template_directory_uri() . '/js/three.min.js');
	wp_enqueue_script('three-js');

	// loader script for tweening values for animation
	wp_register_script('tweenMax', 'http://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.0/TweenMax.min.js');
	wp_enqueue_script('tweenMax');

	// loader script for threejs obj
	wp_register_script('loader-obj', get_template_directory_uri() . '/js/loaders/OBJLoader.js');
	wp_enqueue_script('loader-obj');
	
	wp_register_script('projector', get_template_directory_uri() . '/js/renderers/Projector.js');
	wp_enqueue_script('projector');
	
	// snap svg for rendering the menu
	wp_register_script('snap-svg', get_template_directory_uri() . '/js/snap.svg-min.js');
	wp_enqueue_script('snap-svg');

	//register a master functionfile, lets do it all in one file
	wp_register_script('oompthree-ui', get_template_directory_uri() . '/js/oompthree-ui.js');
	wp_enqueue_script('oompthree-ui');

}
add_action('wp_enqueue_scripts','oompthree_custom_scripts');
/**
 * Implement the Custom Header feature.
 */
//require get_template_directory() . '/inc/custom-header.php';

/** 
 *	remove the stupid admin bar space
 *  https://davidwalsh.name/remove-wordpress-admin-bar-css
*/
add_action('get_header', 'remove_admin_login_header');

function remove_admin_login_header() {
	remove_action('wp_head', '_admin_bar_bump_cb');
}
/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Custom functions that act independently of the theme templates.
 */
require get_template_directory() . '/inc/extras.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
require get_template_directory() . '/inc/jetpack.php';
