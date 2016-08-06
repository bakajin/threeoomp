<?php
/**
 * The header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="content">
 *
 * @package oompthree
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?php wp_title( '|', true, 'right' ); ?></title>
<link rel="profile" href="http://gmpg.org/xfn/11">
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
<link href="https://fonts.googleapis.com/css?family=Source+Code+Pro:600|Source+Sans+Pro:200,300,400,600" rel="stylesheet">
<script>
		pageType = '<?php body_class(); ?>';
		themePath = "<?php echo get_stylesheet_directory_uri(); ?>"; 
		
		<?php 
		//lets send the navigation array to javascript
		// Get the nav menu based on $menu_name (same as 'theme_location' or 'menu' arg to wp_nav_menu)
    	// This code based on wp_nav_menu's code to get Menu ID from menu slug

   		//$menu_name = 'main-navigation';
   		$menu_name = 'primary';
    	$menuJsVars = "var menuItems = [";
    	if ( ( $locations = get_nav_menu_locations() ) && isset( $locations[ $menu_name ] ) ) {
			$menu = wp_get_nav_menu_object( $locations[ $menu_name ] );
			//print_r(count($menu));
			$menu_items = wp_get_nav_menu_items($menu->term_id);
		
			foreach($menu_items as $menu_item){
				// the items for javascript var
					//this value is 0 for main top level menu items
					//print_r($menu_item->menu_item_parent); //print_r($menu_item->url); //print_r($menu_item->guid);
						$menuJsVars .= '{idx: "' . $menu_item->ID . '", title: "' . $menu_item->title . '", parent: "' . $menu_item->menu_item_parent . '", url: "'. $menu_item->url .'", guid:"'. $menu_item->guid .'"}, ';
			}
	
    	} else {
			// fail
			$menuJsVars .= '{fail: "' . $menu_name . '"}, ';
		}
		$menuJsVars .= '{end: ""}];';
		echo $menuJsVars;
		
		?>
	
</script>
<?php wp_head(); ?>
</head>

<body <?php body_class(); ?> onload="render();">
<div id="page" class="hfeed site">
	<a class="skip-link screen-reader-text" href="#content"><?php _e( 'Skip to content', oompthree ); ?></a>

	<header id="masthead" class="site-header" role="banner">
		<div class="site-branding">
			<h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
			<h2 class="site-description"><?php bloginfo( 'description' ); ?></h2>
		</div>

		<nav id="site-navigation" class="main-navigation" role="navigation">
			<button class="menu-toggle"><?php _e( 'Primary Menu', oompthree ); ?></button>
			<?php wp_nav_menu( array( 'theme_location' => 'primary' ) ); ?>
		</nav>
		<svg id="svg-menu">
			<defs></defs>
		</svg>
		<!-- #site-navigation -->
	</header><!-- #masthead -->

	<div id="content" class="site-content">
		<div id="canvas3d"></div>
