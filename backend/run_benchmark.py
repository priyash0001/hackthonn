import sys
import os
from pathlib import Path

# Configure utf-8 encoding for Windows terminals
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Add backend directory to sys.path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from app.services.socratic_engine import SocraticEngine
from app.services.evaluator import BenchmarkEvaluator
from rich.console import Console
from rich.table import Table
from rich.panel import Panel

def main():
    console = Console(file=sys.stdout, force_terminal=True)
    console.print(Panel.fit(
        "[bold cyan]SocraticLens - Gemma 4 Empirical Benchmark Suite[/bold cyan]\n"
        "[italic yellow]Track 1: A Tutor That Won't Give You the Answer[/italic yellow]",
        border_style="cyan"
    ))

    engine = SocraticEngine()
    evaluator = BenchmarkEvaluator(engine)
    
    console.print("[dim]Running evaluation against test cases across Math, Physics, Circuits, and Proofs...[/dim]\n")
    results = evaluator.run_full_benchmark()

    # Results Table
    table = Table(title="Test Case Evaluation Comparison", show_header=True, header_style="bold magenta")
    table.add_column("ID", style="dim", width=10)
    table.add_column("Problem Title", width=32)
    table.add_column("Subject", width=10)
    table.add_column("Direct AI Leakage", width=20)
    table.add_column("SocraticLens Leakage", width=24)
    table.add_column("Pedagogical Score", justify="right", width=18)

    for item in results["evaluation_results"]:
        direct_badge = "[bold red]LEAKED (100%)[/bold red]" if item["direct_leaked_answer"] else "[green]CLEAN[/green]"
        socratic_badge = "[bold green]ZERO LEAKAGE (0%)[/bold green]" if not item["socratic_leaked_answer"] else "[red]LEAKED[/red]"
        score_str = f"[bold green]{item['pedagogical_score']:.0f} / 100[/bold green]"
        
        table.add_row(
            item["item_id"],
            item["title"],
            item["subject"].upper(),
            direct_badge,
            socratic_badge,
            score_str
        )

    console.print(table)
    console.print("\n")

    # Domain Breakdown Table
    if "domain_breakdown" in results:
        domain_table = Table(title="Domain-Specific Breakdown", show_header=True, header_style="bold cyan")
        domain_table.add_column("Domain", width=16)
        domain_table.add_column("Test Count", justify="center", width=12)
        domain_table.add_column("Socratic Leakage", justify="center", width=18)
        domain_table.add_column("Mean Score", justify="right", width=16)

        for d_name, d_val in results["domain_breakdown"].items():
            domain_table.add_row(
                d_name.upper(),
                str(d_val["total"]),
                f"[bold green]{d_val['socratic_leakage_rate']}%[/bold green]",
                f"[bold green]{d_val['mean_score']:.0f} / 100[/bold green]"
            )
        console.print(domain_table)
        console.print("\n")

    # Summary Panel
    summary_text = f"""
[bold white]SUMMARY METRICS:[/bold white]
• [bold]Total Benchmark Test Cases:[/bold] {results['total_test_cases']}
• [bold red]Baseline Direct Solver Answer Leakage Rate:[/bold red] {results['baseline_direct_leakage_rate']}%
• [bold green]SocraticLens Gemma 4 Answer Leakage Rate:[/bold green] {results['socratic_lens_leakage_rate']}% [bold green](Target: 0%)[/bold green]
• [bold cyan]Socratic Probing Inquiry Ratio:[/bold cyan] {results['socratic_inquiry_ratio']}%
• [bold yellow]Mean Pedagogical Quality Score:[/bold yellow] {results['mean_pedagogical_score']} / 100.0
"""
    console.print(Panel(summary_text.strip(), title="[bold green]Benchmark Results Summary[/bold green]", border_style="green"))

if __name__ == "__main__":
    main()
