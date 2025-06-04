#!/usr/bin/env python3

import matplotlib.pyplot as plt
import networkx as nx
from matplotlib.patches import FancyBboxPatch
import matplotlib.patches as mpatches

def create_cli_flow_graph():
    G = nx.DiGraph()
    
    # Define nodes with their types for styling
    nodes = [
        ("start", "Start CLI", "start"),
        ("parse_args", "Parse Command Line Arguments", "process"),
        ("inject_env", "Inject Environment Variables", "process"),
        ("render_title", "Render Title", "process"),
        ("user_prompt", "Run User Prompt CLI", "decision"),
        ("config_packages", "Configure Packages", "process"),
        ("scaffold", "Scaffold Base Project", "action"),
        ("install_packages", "Install Packages", "action"),
        ("select_boilerplate", "Select Boilerplate", "action"),
        ("update_package_json", "Update package.json", "action"),
        ("check_install_deps", "Install Dependencies?", "decision"),
        ("install_deps", "Install Dependencies", "action"),
        ("check_migrations", "Run Migrations?", "decision"),
        ("run_migrations", "Execute Migrations", "action"),
        ("check_git", "Initialize Git?", "decision"),
        ("init_git", "Initialize Git Repository", "action"),
        ("open_ide", "Open in IDE", "action"),
        ("success", "Project Initialized Successfully", "end")
    ]
    
    # Add nodes to graph
    for node_id, label, node_type in nodes:
        G.add_node(node_id, label=label, type=node_type)
    
    # Define edges (process flow)
    edges = [
        ("start", "parse_args"),
        ("parse_args", "inject_env"),
        ("inject_env", "render_title"),
        ("render_title", "user_prompt"),
        ("user_prompt", "config_packages"),
        ("config_packages", "scaffold"),
        ("scaffold", "install_packages"),
        ("install_packages", "select_boilerplate"),
        ("select_boilerplate", "update_package_json"),
        ("update_package_json", "check_install_deps"),
        ("check_install_deps", "install_deps"),
        ("check_install_deps", "check_migrations"),
        ("install_deps", "check_migrations"),
        ("check_migrations", "run_migrations"),
        ("check_migrations", "check_git"),
        ("run_migrations", "check_git"),
        ("check_git", "init_git"),
        ("check_git", "open_ide"),
        ("init_git", "open_ide"),
        ("open_ide", "success")
    ]
    
    G.add_edges_from(edges)
    
    return G, nodes

def visualize_graph():
    G, nodes = create_cli_flow_graph()
    
    # Set up the plot
    plt.figure(figsize=(16, 20))
    
    # Create hierarchical layout
    pos = nx.spring_layout(G, k=3, iterations=50, seed=42)
    
    # Manually adjust positions for better flow
    manual_positions = {
        "start": (0, 10),
        "parse_args": (0, 9),
        "inject_env": (0, 8),
        "render_title": (0, 7),
        "user_prompt": (0, 6),
        "config_packages": (0, 5),
        "scaffold": (0, 4),
        "install_packages": (0, 3),
        "select_boilerplate": (0, 2),
        "update_package_json": (0, 1),
        "check_install_deps": (0, 0),
        "install_deps": (-2, -1),
        "check_migrations": (0, -2),
        "run_migrations": (-2, -3),
        "check_git": (0, -4),
        "init_git": (-2, -5),
        "open_ide": (0, -6),
        "success": (0, -7)
    }
    
    # Color mapping for different node types
    color_map = {
        "start": "#4CAF50",      # Green
        "process": "#2196F3",    # Blue
        "decision": "#FF9800",   # Orange
        "action": "#9C27B0",     # Purple
        "end": "#F44336"         # Red
    }
    
    # Draw nodes with different shapes and colors based on type
    for node_id, label, node_type in nodes:
        x, y = manual_positions[node_id]
        color = color_map[node_type]
        
        if node_type == "decision":
            # Diamond shape for decisions
            diamond = mpatches.RegularPolygon((x, y), 4, radius=0.3, 
                                            orientation=3.14159/4, 
                                            facecolor=color, 
                                            edgecolor='black',
                                            alpha=0.8)
            plt.gca().add_patch(diamond)
        elif node_type in ["start", "end"]:
            # Circle for start/end
            circle = mpatches.Circle((x, y), 0.25, 
                                   facecolor=color, 
                                   edgecolor='black',
                                   alpha=0.8)
            plt.gca().add_patch(circle)
        else:
            # Rectangle for processes and actions
            rect = FancyBboxPatch((x-0.4, y-0.15), 0.8, 0.3,
                                 boxstyle="round,pad=0.02",
                                 facecolor=color,
                                 edgecolor='black',
                                 alpha=0.8)
            plt.gca().add_patch(rect)
    
    # Draw edges
    for edge in G.edges():
        start_pos = manual_positions[edge[0]]
        end_pos = manual_positions[edge[1]]
        
        # Draw arrow
        plt.annotate('', xy=end_pos, xytext=start_pos,
                    arrowprops=dict(arrowstyle='->', 
                                  connectionstyle='arc3,rad=0.1',
                                  color='black', 
                                  lw=1.5))
    
    # Add labels
    for node_id, label, node_type in nodes:
        x, y = manual_positions[node_id]
        plt.text(x, y, label, ha='center', va='center', 
                fontsize=8, fontweight='bold', 
                bbox=dict(boxstyle="round,pad=0.3", 
                         facecolor='white', 
                         alpha=0.8))
    
    # Add conditional flow labels
    plt.text(-1, -1.5, "if installDependencies", ha='center', va='center', 
            fontsize=7, style='italic', color='gray')
    plt.text(-1, -3.5, "if runMigrations &\nSQLite & Drizzle", ha='center', va='center', 
            fontsize=7, style='italic', color='gray')
    plt.text(-1, -5.5, "if initializeGit", ha='center', va='center', 
            fontsize=7, style='italic', color='gray')
    
    # Create legend
    legend_elements = [
        mpatches.Patch(color=color_map["start"], label='Start/End'),
        mpatches.Patch(color=color_map["process"], label='Process'),
        mpatches.Patch(color=color_map["decision"], label='Decision'),
        mpatches.Patch(color=color_map["action"], label='Action')
    ]
    plt.legend(handles=legend_elements, loc='upper right')
    
    plt.title('Create Electron Foundation CLI - Process Flow', 
             fontsize=16, fontweight='bold', pad=20)
    
    # Set equal aspect ratio and adjust limits
    plt.axis('equal')
    plt.xlim(-3, 3)
    plt.ylim(-8, 11)
    plt.axis('off')
    
    plt.tight_layout()
    plt.show()

def print_process_summary():
    print("CREATE ELECTRON FOUNDATION CLI - PROCESS FLOW")
    print("=" * 50)
    print()
    
    steps = [
        ("1", "Parse Command Line Arguments", 
         "Extract project name, router, database, ORM, styles options"),
        ("2", "Inject Environment Variables", 
         "Set APP_NAME environment variable"),
        ("3", "Render Title", 
         "Display CLI banner/title"),
        ("4", "Run User Prompt CLI", 
         "Interactive prompts for missing configurations"),
        ("5", "Configure Packages", 
         "Build package installer map based on selections"),
        ("6", "Scaffold Base Project", 
         "Create project directory structure"),
        ("7", "Install Packages", 
         "Install selected npm packages"),
        ("8", "Select Boilerplate", 
         "Apply boilerplate code based on selections"),
        ("9", "Update package.json", 
         "Set project name in package.json"),
        ("10", "Install Dependencies (Optional)", 
         "Run npm install if requested"),
        ("11", "Run Migrations (Conditional)", 
         "Execute database setup if SQLite + Drizzle"),
        ("12", "Initialize Git (Optional)", 
         "Create git repo and initial commit"),
        ("13", "Open in IDE", 
         "Launch project in specified IDE"),
        ("14", "Success Message", 
         "Display completion message")
    ]
    
    for step_num, title, description in steps:
        print(f"{step_num:2s}. {title}")
        print(f"    {description}")
        print()

if __name__ == "__main__":
    print_process_summary()
    print("Generating graph visualization...")
    visualize_graph() 